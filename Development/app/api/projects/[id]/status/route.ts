import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { supabaseAdmin } from '../../../../../lib/supabase-admin';
import { updateProjectStatus } from '../../../../../lib/services/project-service';
import type { ProjectStatus } from '../../../../../lib/state-machines/types';

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
 * PATCH /api/projects/[id]/status
 * Customer-safe status update with state machine validation.
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

    const { data: project, error: projectError } = await supabaseAdmin
      .from('active_projects')
      .select('id, user_id, client_id, client_email')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    const matchesOwner =
      project.user_id === currentUser.id ||
      project.client_id === currentUser.id ||
      (project.client_email && project.client_email === currentUser.email);

    if (!matchesOwner) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body: UpdateStatusRequest = await request.json();
    const { status: newStatus, notes } = body;

    if (!newStatus) {
      return Response.json({ error: 'Status is required' }, { status: 400 });
    }

    const result = await updateProjectStatus(
      projectId,
      newStatus,
      currentUser.id,
      false,
      notes
    );

    if (!result.success) {
      return Response.json(
        { error: result.error, previousStatus: result.previousStatus },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      previousStatus: result.previousStatus,
      newStatus: result.newStatus,
      warning: result.warning,
    });
  } catch (error) {
    console.error('Customer project status error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
