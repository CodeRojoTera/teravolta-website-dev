'use client';

import { ReactNode } from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular' | 'card';
    width?: string | number;
    height?: string | number;
    count?: number;
}

export function Skeleton({
    className = '',
    variant = 'text',
    width,
    height,
    count = 1
}: SkeletonProps) {
    const baseClasses = 'animate-pulse bg-gray-200 rounded';

    const variantClasses = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
        card: 'rounded-xl'
    };

    const style: React.CSSProperties = {
        width: width || (variant === 'text' ? '100%' : undefined),
        height: height || (variant === 'text' ? '1rem' : undefined)
    };

    const items = Array.from({ length: count }, (_, i) => (
        <div
            key={i}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        />
    ));

    return count === 1 ? items[0] : <>{items}</>;
}

// Dashboard card skeleton
export function DashboardCardSkeleton() {
    return (
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton variant="circular" width={48} height={48} />
                <Skeleton width={60} height={24} />
            </div>
            <Skeleton width="60%" height={20} />
            <Skeleton width="40%" height={14} />
        </div>
    );
}

// Table row skeleton
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
    return (
        <tr className="border-b border-gray-100">
            {Array.from({ length: columns }, (_, i) => (
                <td key={i} className="px-6 py-4">
                    <Skeleton width={i === 0 ? '80%' : '60%'} />
                </td>
            ))}
        </tr>
    );
}

// List item skeleton
export function ListItemSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-1 space-y-2">
                <Skeleton width="70%" height={16} />
                <Skeleton width="40%" height={12} />
            </div>
            <Skeleton width={80} height={28} className="rounded-full" />
        </div>
    );
}

// Full page loading skeleton
export function PageLoadingSkeleton({ title }: { title?: string }) {
    return (
        <div className="space-y-6 animate-fade-in">
            {title && (
                <div className="space-y-2">
                    <Skeleton width={200} height={32} />
                    <Skeleton width={300} height={16} />
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardCardSkeleton />
                <DashboardCardSkeleton />
                <DashboardCardSkeleton />
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <Skeleton width={150} height={24} />
                </div>
                <table className="w-full">
                    <tbody className="divide-y divide-gray-100">
                        <TableRowSkeleton />
                        <TableRowSkeleton />
                        <TableRowSkeleton />
                    </tbody>
                </table>
            </div>
        </div>
    );
}
