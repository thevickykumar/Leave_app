import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';


function Private({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'manager' ? '/manager' : '/employee'} replace />;
  return children;
}


export default function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? (user.role === 'manager' ? '/manager' : '/employee') : '/login'} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/employee" element={<Private role="employee"><EmployeeDashboard /></Private>} />
      <Route path="/manager" element={<Private role="manager"><ManagerDashboard /></Private>} />
    </Routes>
  );
}