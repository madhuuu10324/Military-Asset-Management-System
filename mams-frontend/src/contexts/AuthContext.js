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

    const fetchUserData = async (token) => {
        try {
            const response = await api.get('/users/me/');
            return response.data;
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            return null;
        }
    };

    const initializeAuth = async (token) => {
        if (token) {
            const decodedToken = decodeJwt(token);
            if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
                // The token is valid, fetch user data from the backend
                const userData = await fetchUserData(token);
                if (userData) {
                    setUser(userData);
                    return true;
                }
            }
        }
        return false;
    };

    useEffect(() => {
        // Check for a token on initial load to maintain session
        const token = localStorage.getItem('accessToken');
        if (token) {
            initializeAuth(token).finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post('/token/', { username, password });
            const { access, refresh } = response.data;
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            await initializeAuth(access); // Initialize user from the new token
            router.push('/dashboard');
        } catch (error) {
            console.error("Login failed:", error);
            throw error; // Re-throw to handle in the login component
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
        loading,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};