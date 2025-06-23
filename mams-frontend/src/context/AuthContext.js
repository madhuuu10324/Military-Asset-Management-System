"use client"; // This is a client-side context

import { createContext, useState, useContext, useEffect } from 'react';
import api from '@/lib/api'; // We will create this next
import { useRouter } from 'next/navigation';

// A simple JWT decoder
const decodeJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const initializeAuth = (token) => {
        if (token) {
            const decodedToken = decodeJwt(token);
            if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
                // The token is valid, set the user object
                setUser({
                    username: decodedToken.username, // Assuming your token has username
                    role: decodedToken.role,         // **CRUCIAL: Add role to your JWT payload**
                    base: decodedToken.base,         // **Add base to your JWT payload**
                });
                return true;
            }
        }
        return false;
    };

    useEffect(() => {
        // Check for a token on initial load to maintain session
        const token = localStorage.getItem('accessToken');
        if (token) {
            // Here you would typically fetch user data from a `/api/users/me/` endpoint
            // For now, we'll just set a placeholder user if a token exists
            setUser({ username: 'Authenticated User' }); // Placeholder
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post('/token/', { username, password });
            const { access, refresh } = response.data;
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            initializeAuth(access); // Initialize user from the new token
            router.push('/dashboard');
        } catch (error) {
            console.error("Login failed:", error);
            // Handle error
        }
    };

    const logout = () => {
        // Clear user state and tokens
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.push('/login');
    };

    const authContextValue = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};