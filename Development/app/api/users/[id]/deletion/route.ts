import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { supabaseAdmin } from '../../../../../lib/supabase-admin';
import {
  scheduleUserDeletion,
  cancelScheduledDeletion,
  executeHardDelete,
} from '../../../../../lib/services/user-deletion';
import type { DeletionReason } from '../../../../../lib/services/deletion-audit';

type DeletionAction = 'schedule' | 'cancel' | 'hard';

interface DeletionRequestBody {
  action: DeletionAction;
  reason?: DeletionReason;
  notes?: string;
  forceDelete?: boolean;
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

async function getUserRole(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data.role as string | null;
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const targetUserId = params.id;
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: DeletionRequestBody = await request.json();
    const { action, reason, notes, forceDelete } = body;

    if (!action) {
      return Response.json({ error: 'Action is required' }, { status: 400 });
    }

    const isSelf = currentUser.id === targetUserId;
    const role = await getUserRole(currentUser.id);
    const isAdmin = role ? ['admin', 'super_admin'].includes(role) : false;

    if (!isSelf && !isAdmin) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (action === 'hard' && !isAdmin) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (action === 'schedule') {
      if (!reason) {
        return Response.json({ error: 'Reason is required' }, { status: 400 });
      }

      const result = await scheduleUserDeletion(targetUserId, {
        requestedBy: currentUser.id,
        reason,
        forceDelete,
        notes,
      });

      if (!result.success) {
        return Response.json({ error: result.error }, { status: 400 });
      }

      return Response.json(result);
    }

    if (action === 'cancel') {
      const result = await cancelScheduledDeletion(targetUserId);
      if (!result.success) {
        return Response.json({ error: result.error }, { status: 400 });
      }

      return Response.json(result);
    }

    if (action === 'hard') {
      if (!reason) {
        return Response.json({ error: 'Reason is required' }, { status: 400 });
      }

      const result = await executeHardDelete(targetUserId, {
        requestedBy: currentUser.id,
        reason,
        forceDelete,
        notes,
      });

      if (!result.success) {
        return Response.json({ error: result.error }, { status: 400 });
      }

      return Response.json(result);
    }

    return Response.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error) {
    console.error('User deletion error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
