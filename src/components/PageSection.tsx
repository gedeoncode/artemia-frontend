import { ReactNode } from 'react';

export function PageSection({ children,className }: { children: ReactNode, className?:string }) {
  return <div className={`space-y-6  px-4 py-4 sm:px-6 sm:py-6 lg:px-8 ${className}`}>{children}</div>;
}

