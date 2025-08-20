import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchDashboard } from '../features/dashboard/dashboardSlice';

export const useDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  return { stats, loading, error };
};
