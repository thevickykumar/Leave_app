import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';


export default function Login() {
    const { user, login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    if (user) return <Navigate to={user.role === 'manager' ? '/manager' : '/employee'} replace />;


    async function submit(e) {
        e.preventDefault(); setError(''); setLoading(true);
        try { await login(email, password); }
        catch (e) { setError(e.response?.data?.error || 'Login failed'); }
        finally { setLoading(false); }
    }


    return (
        <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
            <form onSubmit={submit} className="card w-full max-w-sm p-6 space-y-4">
                <h1 className="text-xl font-semibold">Sign in</h1>
                <label className="block">
                    <div className="text-sm text-gray-700">Email</div>
                    <input className="mt-1 h-10 w-full rounded-xl border px-3" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </label>
                <label className="block">
                    <div className="text-sm text-gray-700">Password</div>
                    <input className="mt-1 h-10 w-full rounded-xl border px-3" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </label>
                {error && <div className="text-sm text-red-600">{error}</div>}
                <button className="btn btn-primary w-full" disabled={loading}>Sign in</button>
                <div className="text-xs text-gray-500">Try demo: bob@demo.com / password123</div>
            </form>
        </div>
    );
}