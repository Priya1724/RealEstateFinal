import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || user.role !== 'ROLE_ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
