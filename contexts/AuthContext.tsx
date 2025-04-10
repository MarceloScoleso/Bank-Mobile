import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

type AuthContextType = {
token: string | null;
login: (token: string) => void;
logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
const [token, setToken] = useState<string | null>(null);
const TOKEN_KEY = 'userToken';

useEffect(() => {
    const loadToken = async () => {
    const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);
    if (savedToken) {
        setToken(savedToken);
    }
    };
    loadToken();
}, []);

const login = async (newToken: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    setToken(newToken);
};

const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setToken(null);
};

return (
    <AuthContext.Provider value={{ token, login, logout }}>
    {children}
    </AuthContext.Provider>
);
};

export const useAuth = (): AuthContextType => {
const context = useContext(AuthContext);
if (!context) {
    throw new Error('useAuth precisa estar dentro de AuthProvider');
}
return context;
};
