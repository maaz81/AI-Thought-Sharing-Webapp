import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { admin, loading, error } = useSelector((state) => state.auth);
  return { admin, loading, error, isAuthenticated: !!admin };
};
