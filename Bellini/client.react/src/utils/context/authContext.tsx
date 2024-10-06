import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
    id: string;
    username: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User, accessToken: string, refreshToken: string) => void;
    logout: () => void;
    getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        const storedAccessToken = sessionStorage.getItem('access-token');
        const storedRefreshToken = sessionStorage.getItem('refresh-token');

        if (storedUser && storedAccessToken && storedRefreshToken) {
            setUser(JSON.parse(storedUser));
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
        }
    }, []);

    const login = (userData: User, accessToken: string, refreshToken: string) => {
        setUser(userData);
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);

        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('access-token', accessToken);
        sessionStorage.setItem('refresh-token', refreshToken);
    };

    const logout = () => {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);

        sessionStorage.removeItem('user');
        sessionStorage.removeItem('access-token');
        sessionStorage.removeItem('refresh-token');
    };


    const getAccessToken = async (): Promise<string | null> => {
        if (!accessToken || !refreshToken) {
            return null;
        }

        const tokenExpires = jwtDecode<{ exp: number }>(accessToken).exp * 1000;
        if (Date.now() >= tokenExpires) {
            try {
                const response = await axios.post('/api/auth/refresh', { token: refreshToken });
                const newAccessToken = response.data.accessToken;
                setAccessToken(newAccessToken);
                sessionStorage.setItem('access-token', newAccessToken);
                return newAccessToken;
            } catch (error) {
                logout();
                return null;
            }
        }
        return accessToken;
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, getAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Декодер JWT для проверки времени жизни токена
const jwtDecode = <T extends object>(token: string): T => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        throw new Error('Invalid token');
    }
};
