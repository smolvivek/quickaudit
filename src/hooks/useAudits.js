import { useState, useEffect, useCallback } from 'react';
import { auditApi } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'audits_cache';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export const useAudits = (initialFilters = {}) => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  // Load audits from cache
  const loadFromCache = async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          setAudits(data);
          setLoading(false);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error loading from cache:', error);
      return false;
    }
  };

  // Save audits to cache
  const saveToCache = async (data) => {
    try {
      await AsyncStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  };

  // Fetch audits from API
  const fetchAudits = useCallback(async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await auditApi.getAllAudits({
        ...filters,
        page: pagination.page,
      });

      setAudits(response.audits);
      setPagination({
        page: response.page,
        totalPages: response.totalPages,
        total: response.total,
      });

      // Save to cache
      await saveToCache(response.audits);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters, pagination.page]);

  // Initial load
  useEffect(() => {
    const initialize = async () => {
      const fromCache = await loadFromCache();
      if (!fromCache) {
        await fetchAudits();
      }
    };
    initialize();
  }, []);

  // Refresh audits
  const refresh = useCallback(async () => {
    await fetchAudits(true);
  }, [fetchAudits]);

  // Load more audits
  const loadMore = useCallback(async () => {
    if (pagination.page < pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  }, [pagination.page, pagination.totalPages]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Create new audit
  const createAudit = useCallback(async (auditData) => {
    try {
      setLoading(true);
      const newAudit = await auditApi.createAudit(auditData);
      setAudits(prev => [newAudit, ...prev]);
      return newAudit;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update audit
  const updateAudit = useCallback(async (id, auditData) => {
    try {
      setLoading(true);
      const updatedAudit = await auditApi.updateAudit(id, auditData);
      setAudits(prev =>
        prev.map(audit => (audit.id === id ? updatedAudit : audit))
      );
      return updatedAudit;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete audit
  const deleteAudit = useCallback(async (id) => {
    try {
      setLoading(true);
      await auditApi.deleteAudit(id);
      setAudits(prev => prev.filter(audit => audit.id !== id));
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add finding to audit
  const addFinding = useCallback(async (auditId, findingData) => {
    try {
      setLoading(true);
      const finding = await auditApi.addFinding(auditId, findingData);
      setAudits(prev =>
        prev.map(audit => {
          if (audit.id === auditId) {
            return {
              ...audit,
              findings: [...audit.findings, finding],
            };
          }
          return audit;
        })
      );
      return finding;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update finding
  const updateFinding = useCallback(async (auditId, findingId, findingData) => {
    try {
      setLoading(true);
      const updatedFinding = await auditApi.updateFinding(
        auditId,
        findingId,
        findingData
      );
      setAudits(prev =>
        prev.map(audit => {
          if (audit.id === auditId) {
            return {
              ...audit,
              findings: audit.findings.map(finding =>
                finding.id === findingId ? updatedFinding : finding
              ),
            };
          }
          return audit;
        })
      );
      return updatedFinding;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete finding
  const deleteFinding = useCallback(async (auditId, findingId) => {
    try {
      setLoading(true);
      await auditApi.deleteFinding(auditId, findingId);
      setAudits(prev =>
        prev.map(audit => {
          if (audit.id === auditId) {
            return {
              ...audit,
              findings: audit.findings.filter(finding => finding.id !== findingId),
            };
          }
          return audit;
        })
      );
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
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
    createAudit,
    updateAudit,
    deleteAudit,
    addFinding,
    updateFinding,
    deleteFinding,
  };
}; 