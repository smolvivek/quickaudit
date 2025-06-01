import {useState, useCallback} from 'react';
import {auditApi, Audit, Filters, Pagination} from '../services/api';
import {colors} from '../theme/designSystem';

export const useAudits = () => {
  const [audits, setAudits] = useState<Audit[]>([]);
  

const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: '',
  });

  const fetchAudits = useCallback(async (page: number, filters: Filters) => {
    try {
      const response = await auditApi.getAll(page, filters);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await fetchAudits(1, filters);
      setAudits(response.data);
      setPagination(response.pagination);
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to fetch audits',
      );
    } finally {
      setRefreshing(false);
    }
  }, [fetchAudits, filters]);

  const loadMore = useCallback(async () => {
    if (loading || pagination.page >= pagination.totalPages) {
      return;
    }

    setLoading(true);
    try {
      const nextPage = pagination.page + 1;
      const response = await fetchAudits(nextPage, filters);
      setAudits((prev: Audit[]) => [...prev, ...response.data]);
      setPagination(response.pagination);
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to load more audits',
      );
    } finally {
      setLoading(false);
    }
  }, [loading, pagination, fetchAudits, filters]);

  const updateFilters = useCallback((newFilters: Partial<Filters>) => {
    setFilters((prev: Filters) => ({...prev, ...newFilters}));
  }, []);

  return {
    audits,
    loading,
    error,
    refreshing,
    pagination,
    filters,
    refresh,
    loadMore,
    updateFilters,
  };
};
