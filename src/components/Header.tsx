import React, {useEffect, useState} from 'react';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import {useRole} from "../context/RoleContext";

const Header = ({ isAuthenticated, user }) => {
    const { logout: logoutUser } = useAuth();
    const navigate = useNavigate();

    const { role } = useRole();

    /*const [role, setRole] = useState('');
    useEffect(() => {
        // Получаем роль из localStorage при монтировании компонента
        const savedRole = localStorage.getItem('userRole');
        if (savedRole) {
            setRole(savedRole);
        }
    }, []);*/

    const hasLastName = user && user.lastname && user.lastname.trim() !== '';
    const hasFirstName = user && user.firstname && user.firstname.trim() !== '';

    let fio;
    if (hasLastName && hasFirstName) {
        fio = `${user.firstname} ${user.lastname}`;
    } else if (user && user.id && user.id === 5) {
        fio = 'admin';
    } else {
        fio = ''; // Можно задать значение по умолчанию, если нужно
    }

    const handleLogout = async (e) => {
        e.preventDefault();
        await logoutUser();
        navigate(-1);
    }

    const handleLogin = () => {
        navigate('/login'); // Замените '/login' на путь к вашей странице авторизации
    }

    return (
        <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md">
            <div>
                <div className="text-gray-900 dark:text-white font-bold">{role || ''}</div>
                <div className="text-gray-600 dark:text-gray-300 text-sm">{fio}</div>
            </div>
            <button
                className="flex items-center text-gray-600 dark:text-gray-300"
                // onClick={isAuthenticated ? handleLogout : handleLogin}
                onClick={isAuthenticated ? handleLogout : handleLogin}
            >
                {isAuthenticated ? (
                    <>
                        <Lock className="w-5 h-5 mr-2" />
                        Logout
                    </>
                ) : (
                    <>
                        <Lock className="w-5 h-5 mr-2" />
                        Login
                    </>
                )}
            </button>
        </div>
    );
};

export default Header;
