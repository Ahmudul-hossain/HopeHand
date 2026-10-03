import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // or a spinner if you have one
  }

  if (!user) {
    return <Navigate to="/res-ngo-selector" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    const myHome = user.role === 'ngo' ? '/ngo-page' : '/home-page';
    return <Navigate to={myHome} replace />;
  }

  return children;
}
export default ProtectedRoute;