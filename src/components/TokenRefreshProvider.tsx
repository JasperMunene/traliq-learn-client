'use client';

import { useEffect } from 'react';
import { initializeTokenRefresh, cleanupTokenRefresh } from '@/lib/api';
import { usePathname } from 'next/navigation';

/**
 * TokenRefreshProvider Component
 * Initializes automatic token refresh scheduling when the app loads
 * and cleans up when the component unmounts
 */
export default function TokenRefreshProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    useEffect(() => {
        // Only initialize token refresh for authenticated routes
        // Skip for auth pages to avoid unnecessary token checks
        const isAuthPage = pathname?.startsWith('/auth');
        
        if (!isAuthPage) {
            console.log('Initializing token refresh scheduler...');
            initializeTokenRefresh();
        }

        // Cleanup on unmount
        return () => {
            cleanupTokenRefresh();
        };
    }, [pathname]);

    return <>{children}</>;
}
