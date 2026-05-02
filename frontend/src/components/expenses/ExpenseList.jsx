import ExpenseCard from './ExpenseCard';
import LoadingSpinner from '../shared/LoadingSpinner';

export default function ExpenseList({ expenses, loading, onEdit, onDelete, onAdd }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1,2,3].map(i => (
          <div key={i} className="bg-white rounded-xl shadow-sm px-5 py-4 animate-pulse flex gap-4 items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
            <div className="h-5 bg-gray-200 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (!expenses.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="text-5xl mb-3">💸</div>
        <p className="text-gray-500 mb-4">No expenses yet. Add your first one!</p>
        <button
          onClick={onAdd}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + Add Expense
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map(e => (
        <ExpenseCard key={e._id} expense={e} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
