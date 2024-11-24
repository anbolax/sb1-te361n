import React, { createContext, useContext, useState, useEffect } from 'react';

interface RoleContextType {
    role: string;
    setRole: (role: string) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [role, setRole] = useState<string>(() => {
        const savedRole = localStorage.getItem('userRole');
        return savedRole ? savedRole : '';
    });

    useEffect(() => {
        localStorage.setItem('userRole', role);
    }, [role]);

    return (
        <RoleContext.Provider value={{ role, setRole }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRole = () => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error('useRole must be used within a RoleProvider');
    }
    return context;
};
