import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function RedirectIfLoggedIn({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Navigate to={user.role === 'ngo' ? '/ngo-page' : '/home-page'} replace />;
  }

  return children;
}

export default RedirectIfLoggedIn;