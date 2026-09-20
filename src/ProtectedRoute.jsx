import { Navigate } from 'react-router-dom';
import { isLoggedIn, getRole } from './auth';

function ProtectedRoute({ children, allowedRole }) {
  if (!isLoggedIn()) {
    return <Navigate to="/res-ngo-selector" replace />;
  }

  if (allowedRole && getRole() !== allowedRole) {
    const myHome = getRole() === 'ngo' ? '/ngo-page' : '/home-page';
    return <Navigate to={myHome} replace />;
  }

  return children;
}
export default ProtectedRoute;