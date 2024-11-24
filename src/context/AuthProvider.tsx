import React, {createContext, useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useRole} from "./RoleContext";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (userData: any) => void;
    logout: () => void;
    user: any;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
        return localStorage.getItem('is_loginned') === 'true';
    });
    // const [user, setUser] = useState({ name: 'Иванов Иван', role: 'Бригадир' });
    const [user, setUser] = useState({ name: '', role: '' });

    const { setRole } = useRole();

    const login = (userData, token) => {
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('is_loginned', 'true');
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.setItem('is_loginned', 'false');
        localStorage.setItem('token', '');
        localStorage.setItem('user', '{}');
        localStorage.setItem('userRole', '');
        setRole('');
    };

    useEffect(() => {
        const isLoginned = localStorage.getItem('is_loginned') === 'true';
        if (isLoginned) {
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            setIsAuthenticated(true);
            setUser(storedUser);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
