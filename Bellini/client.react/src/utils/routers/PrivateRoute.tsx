import {useEffect, useState} from "react";
import {serverFetch} from "@/utilds/fetch's/serverFetch.ts";
import {Navigate, Outlet} from "react-router-dom";

interface AuthContext {
    accessToken: string | null;
    refreshToken: string | null;
}

export const PrivateRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const tokens: AuthContext = {
        accessToken: sessionStorage.getItem('__access-token'),
        refreshToken: sessionStorage.getItem('__refresh-token')
    };

    useEffect(() => {
        const checkAuth = async () => {
            if (tokens.accessToken) {
                try {
                    const response = await serverFetch(`/auth/login/protected`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${tokens.accessToken}`,
                        },
                    });

                    if (response.ok) {
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                    }
                } catch (error) {
                    console.error('Error verifying authentication:', error);
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false);
        };

        checkAuth();
    }, [tokens.accessToken]);

    if (loading) {
        return (
            <>
                <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                    role="status">
                      <span
                          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                          Loading...
                      </span>
                </div>
            </>
        );
    }

    return (
        isAuthenticated ? <Outlet/> : <Navigate to="/login"/>
    );
}