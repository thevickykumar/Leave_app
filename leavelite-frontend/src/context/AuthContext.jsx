import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';


const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);


export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return setLoading(false);
                const { data } = await api.get('/auth/me');
                setUser(data.user);
            } finally { setLoading(false); }
        })();
    }, []);


    async function login(email, password) {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        setUser(data.user);
    }


    function logout() { localStorage.removeItem('token'); setUser(null); }


    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}