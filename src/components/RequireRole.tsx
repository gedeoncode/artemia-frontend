// components/RequireRole.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type RequireRoleProps = {
  children: React.ReactNode;
  allowedRoles: string[];
};

export default function RequireRole({ children, allowedRoles }: RequireRoleProps) {
  const  { loading } = useAuth();
  const user = useAuth().user;
  const userRole = user?.role;
  const router = useRouter();
 
  useEffect(() => {
    if (!loading) {
      if (!user || !userRole || !allowedRoles.includes(userRole)) {
        router.replace('/not-authorized'); 
      }
    }
  }, [user, userRole, loading, allowedRoles, router]);

  if (loading || !user || !userRole) return null; 

  return allowedRoles.includes(userRole) ? <>{children}</> : null;
}


