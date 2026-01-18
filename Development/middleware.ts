import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Create Supabase Client with Cookie Management
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    // Refresh Session
    const { data: { user } } = await supabase.auth.getUser()

    // Protected Routes Logic
    // 1. If trying to access /portal/* but NOT /portal/login or /portal/forgot-password or /register
    //    and NOT authenticated -> Redirect to /portal/login

    const path = request.nextUrl.pathname;
    const isPortalRoute = path.startsWith('/portal');
    const isAuthRoute = path === '/portal/login' || path === '/portal/register' || path === '/portal/forgot-password';

    // Protect all /portal routes except login/register/forgot-password
    if (isPortalRoute && !isAuthRoute && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/portal/login'
        url.searchParams.set('redirect_to', path) // Save original path
        return NextResponse.redirect(url)
    }

    // Redirect authenticated users trying to access login page
    if (isAuthRoute && user) {
        // Retrieve user role to redirect correctly is complex in middleware without a DB call loop
        // For now, let the client page handle the specific role redirection to avoid overhead,
        // OR just redirect to a generic landing that handles routing.
        // But strictly speaking, they shouldn't be at login.
        const url = request.nextUrl.clone()
        url.pathname = '/portal' // A routing page or generic dashboard
        // However, /portal might be protected and need a role. 
        // Let's stick to protecting unauthorized access for now. 
        // Automatic forward from login is often better handled by the page itself to decide WHERE (admin vs customer)
        // unless we decode the JWT metadata here.
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images/ (public images)
         * - api/ (API routes - handled separately or protected by their own logic)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|images/|api/).*)',
    ],
}
