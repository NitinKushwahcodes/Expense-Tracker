const ICONS = {
  Food: '🍕', Transport: '🚗', Shopping: '🛍️',
  Entertainment: '🎬', Health: '💊', Utilities: '💡',
  Education: '📚', Other: '📌'
};

export default function ExpenseCard({ expense, onEdit, onDelete }) {
  const date = new Date(expense.date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <div className="bg-white rounded-xl shadow-sm px-5 py-4 flex items-center gap-4">
      <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-xl shrink-0">
        {ICONS[expense.category] || '📌'}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{expense.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{expense.category} · {date}</p>
        {expense.note && <p className="text-xs text-gray-500 mt-0.5 truncate">{expense.note}</p>}
      </div>

      <div className="flex items-center gap-3">
        <span className="font-semibold text-gray-900">₹{expense.amount.toLocaleString('en-IN')}</span>
        <button
          onClick={() => onEdit(expense)}
          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="Edit"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(expense._id)}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
