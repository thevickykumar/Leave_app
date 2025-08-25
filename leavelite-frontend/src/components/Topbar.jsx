import { useAuth } from '../context/AuthContext';


export default function Topbar() {
    const { user, logout } = useAuth();
    return (
        <header className="flex items-center justify-between px-4 h-16 border-b bg-white">
            <div className="font-semibold">Employee Leave Management System</div>
            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{user?.name} ({user?.role})</span>
                <button className="btn btn-ghost" onClick={logout}>Logout</button>
            </div>
        </header>
    );
}