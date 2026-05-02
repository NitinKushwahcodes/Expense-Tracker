import { useState, useCallback } from 'react';
import api from '../api/axios';

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });

  const fetchExpenses = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const res = await api.get('/api/expenses', { params: filters });
      setExpenses(res.data.data.expenses);
      setPagination({
        total: res.data.data.total,
        pages: res.data.data.pages,
        page: res.data.data.page
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSummary = useCallback(async () => {
    const res = await api.get('/api/expenses/summary');
    setSummary(res.data.data);
  }, []);

  const addExpense = async (data) => {
    const res = await api.post('/api/expenses', data);
    return res.data.data;
  };

  const updateExpense = async (id, data) => {
    const res = await api.put(`/api/expenses/${id}`, data);
    return res.data.data;
  };

  const deleteExpense = async (id) => {
    await api.delete(`/api/expenses/${id}`);
  };

  return { expenses, summary, loading, pagination, fetchExpenses, fetchSummary, addExpense, updateExpense, deleteExpense };
}
