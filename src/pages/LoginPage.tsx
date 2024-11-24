import React, { useState } from 'react';
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login: loginUser } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://api.miniapp.ruqi.pro/api/v1/auth/login', { username: login, password: password });
            if (response.data.success) {
                // localStorage.setItem('token', response.data.token);
                // localStorage.setItem('user', JSON.stringify(response.data.data));
                loginUser(response.data.data);
                navigate('/');
            } else {
                setError('Неверные учетные данные');
            }
        } catch (err) {
            setError('Ошибка входа. Попробуйте еще раз.');
        }
    };

    const handleTelegramLogin = () => {
        window.location.href = 'https://telegram.me/your_bot?start=login'; // Замените на URL вашего бота
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Авторизация</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Логин</label>
                        <input
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white h-10 px-3"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white h-10 px-3"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md"
                    >
                        Войти
                    </button>
                </form>
                <div className="flex items-center justify-between mt-4">
                    <button
                        onClick={handleTelegramLogin}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md"
                    >
                        Войти через Telegram
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
