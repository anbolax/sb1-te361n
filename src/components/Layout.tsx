import React from 'react';
import Header from './Header';
import { useAuth } from '../context/AuthProvider';

const Layout = ({ children }) => {
    const { isAuthenticated, user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header isAuthenticated={isAuthenticated} user={user} />
            <main className="max-w-md mx-auto">
                {children}
            </main>
        </div>
    );
};

export default Layout;
