import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { supabaseAdmin } from '../../../../../../lib/supabase-admin';
import { updateProjectStatus, getValidNextStatuses } from '../../../../../../lib/services/project-service';
import type { ProjectStatus } from '../../../../../../lib/state-machines/types';

interface UpdateStatusRequest {
  status: ProjectStatus;
  notes?: string;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function getCookieValue(request: Request, name: string) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : undefined;
}

function getServerClient(request: Request) {
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return getCookieValue(request, name);
      },
      set(_name: string, _value: string, _options: CookieOptions) {
        // No-op: API routes only read session cookies
      },
      remove(_name: string, _options: CookieOptions) {
        // No-op: API routes only read session cookies
      },
    },
  });
}

async function getCurrentUser(request: Request) {
  const supabase = getServerClient(request);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * PATCH /api/admin/projects/[id]/status
 * Update a project's status with state machine validation.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminUser, error: adminError } = await supabaseAdmin
      .from('active_users')
      .select('role')
      .eq('id', currentUser.id)
      .single();

    if (adminError || !adminUser) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const isAdmin = ['admin', 'super_admin'].includes(adminUser.role);

    const body: UpdateStatusRequest = await request.json();
    const { status: newStatus, notes } = body;

    if (!newStatus) {
      return Response.json({ error: 'Status is required' }, { status: 400 });
    }

    const result = await updateProjectStatus(
      projectId,
      newStatus,
      currentUser.id,
      isAdmin,
      notes
    );

    if (!result.success) {
      return Response.json(
        {
          error: result.error,
          previousStatus: result.previousStatus,
        },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      previousStatus: result.previousStatus,
      newStatus: result.newStatus,
      wasOverride: result.wasOverride,
      warning: result.warning,
    });
  } catch (error) {
    console.error('Update project status error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/admin/projects/[id]/status
 * Get current status and valid next statuses for a project.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const languageParam = url.searchParams.get('lang');
    const language = (languageParam === 'es' ? 'es' : 'en') as 'en' | 'es';

    const statusInfo = await getValidNextStatuses(projectId, language);

    if (!statusInfo) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    return Response.json(statusInfo);
  } catch (error) {
    console.error('Get project status error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
