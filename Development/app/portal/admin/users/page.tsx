'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { PageLoadingSkeleton } from '@/components/ui/Skeleton';

// This page redirects to /users/clients as the default view
export default function UsersRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/portal/admin/users/clients');
    }, [router]);

    return <PageLoadingSkeleton />;
}
