import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/shared/Navbar';
import SummaryCards from '../components/dashboard/SummaryCards';
import CategoryChart from '../components/dashboard/CategoryChart';
import ExpenseList from '../components/expenses/ExpenseList';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ErrorToast from '../components/shared/ErrorToast';
import { useExpenses } from '../hooks/useExpenses';

const CATEGORIES = ['All', 'Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Utilities', 'Education', 'Other'];

export default function Dashboard() {
  const { expenses, summary, loading, pagination, fetchExpenses, fetchSummary, addExpense, updateExpense, deleteExpense } = useExpenses();

  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ category: '', month: '', page: 1 });

  const load = useCallback(() => {
    const params = {};
    if (filters.category && filters.category !== 'All') params.category = filters.category;
    if (filters.month) params.month = filters.month;
    params.page = filters.page;
    fetchExpenses(params);
    fetchSummary();
  }, [filters, fetchExpenses, fetchSummary]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (data) => {
    setFormLoading(true);
    try {
      await addExpense(data);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add expense.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    setFormLoading(true);
    try {
      await updateExpense(editingExpense._id, data);
      setEditingExpense(null);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update expense.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await deleteExpense(id);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete expense.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {error && <ErrorToast message={error} onClose={() => setError('')} />}

        <SummaryCards summary={summary} />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <div className="flex gap-2 flex-wrap">
                <select
                  value={filters.category}
                  onChange={e => setFilters(f => ({ ...f, category: e.target.value, page: 1 }))}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {CATEGORIES.map(c => <option key={c} value={c === 'All' ? '' : c}>{c}</option>)}
                </select>

                <input
                  type="month"
                  value={filters.month}
                  onChange={e => setFilters(f => ({ ...f, month: e.target.value, page: 1 }))}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {(filters.category || filters.month) && (
                  <button
                    onClick={() => setFilters({ category: '', month: '', page: 1 })}
                    className="text-xs text-gray-400 hover:text-gray-600 px-2 py-2"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              <button
                onClick={() => { setEditingExpense(null); setShowForm(true); }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                + Add Expense
              </button>
            </div>

            {/* Add/Edit Form */}
            {(showForm || editingExpense) && (
              <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  {editingExpense ? 'Edit Expense' : 'New Expense'}
                </h3>
                <ExpenseForm
                  initial={editingExpense ? {
                    ...editingExpense,
                    date: new Date(editingExpense.date).toISOString().split('T')[0]
                  } : null}
                  onSubmit={editingExpense ? handleUpdate : handleAdd}
                  onCancel={() => { setShowForm(false); setEditingExpense(null); }}
                  loading={formLoading}
                />
              </div>
            )}

            <ExpenseList
              expenses={expenses}
              loading={loading}
              onEdit={(e) => { setShowForm(false); setEditingExpense(e); }}
              onDelete={handleDelete}
              onAdd={() => setShowForm(true)}
            />

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  disabled={filters.page <= 1}
                  onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Prev
                </button>
                <span className="text-sm text-gray-500">
                  {filters.page} / {pagination.pages}
                </span>
                <button
                  disabled={filters.page >= pagination.pages}
                  onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          <div>
            <CategoryChart summary={summary} />
          </div>
        </div>
      </main>
    </div>
  );
}
