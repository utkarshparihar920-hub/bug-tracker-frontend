import { createContext, useContext, useState } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(
        () => localStorage.getItem('token') || null
    );

    const saveAuthData = (data) => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            setToken(data.token);
        }

        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
        }
    };

    const register = async (userData) => {
        const response = await API.post('/auth/register', userData);
        saveAuthData(response.data);
        return response.data;
    };

    const login = async (credentials) => {
        const response = await API.post('/auth/login', credentials);
        saveAuthData(response.data);
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: Boolean(token),
                register,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }

    return context;
};