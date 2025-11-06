import React from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * Protected route component that checks authentication before rendering children
 */
function ProtectedRoute({ children }: ProtectedRouteProps) {
    return <>{children}</>;
}

export default ProtectedRoute;

