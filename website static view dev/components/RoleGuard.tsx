'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface RoleGuardProps {
    children: React.ReactNode;
    requiredRole?: 'super_admin' | 'admin' | 'customer';
}

export default function RoleGuard({ children, requiredRole }: RoleGuardProps) {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [roleLoading, setRoleLoading] = useState(true);

    useEffect(() => {
        const checkUserRole = async () => {
            if (!user) {
                setRoleLoading(false);
                return;
            }

            try {
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserRole(userData.role || 'customer');
                } else {
                    // Default to customer if no doc exists
                    setUserRole('customer');
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
                setUserRole('customer');
            } finally {
                setRoleLoading(false);
            }
        };

        if (!authLoading) {
            checkUserRole();
        }
    }, [user, authLoading]);

    useEffect(() => {
        if (!authLoading && !roleLoading) {
            if (!user) {
                router.push('/login');
                return;
            }

            // Check role requirements
            if (requiredRole) {
                const roleHierarchy = {
                    'customer': 0,
                    'admin': 1,
                    'super_admin': 2
                };

                const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
                const requiredLevel = roleHierarchy[requiredRole];

                if (userLevel < requiredLevel) {
                    router.push('/account'); // Redirect to account if insufficient permissions
                }
            }
        }
    }, [user, userRole, authLoading, roleLoading, requiredRole, router]);

    if (authLoading || roleLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004A90]"></div>
            </div>
        );
    }

    if (!user || (requiredRole && userRole &&
        (roleHierarchy[userRole as keyof typeof roleHierarchy] || 0) <
        (roleHierarchy[requiredRole] || 0))) {
        return null;
    }

    return <>{children}</>;
}

const roleHierarchy = {
    'customer': 0,
    'admin': 1,
    'super_admin': 2
};
