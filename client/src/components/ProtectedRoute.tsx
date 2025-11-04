import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../util/redux/hooks';
import { getCurrentUser } from '../Home/api';
import { useAppDispatch } from '../util/redux/hooks';
import { login } from '../util/redux/userSlice';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * Protected route component that checks authentication before rendering children
 */
function ProtectedRoute({ children }: ProtectedRouteProps) {
    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // If user is not in Redux state, check session
        if (!user.email) {
            getCurrentUser()
                .then((currentUser) => {
                    if (currentUser) {
                        dispatch(
                            login({
                                email: currentUser.email,
                                firstName: currentUser.firstName,
                                lastName: currentUser.lastName,
                                admin: currentUser.admin,
                            }),
                        );
                    }
                    setIsChecking(false);
                })
                .catch(() => {
                    setIsChecking(false);
                });
        } else {
            setIsChecking(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isChecking) {
        return <div>Loading...</div>;
    }

    if (!user.email) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;

