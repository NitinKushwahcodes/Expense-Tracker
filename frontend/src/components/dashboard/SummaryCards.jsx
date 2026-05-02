export default function SummaryCards({ summary }) {
  if (!summary) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1,2,3,4].map(i => (
        <div key={i} className="bg-white rounded-xl shadow-sm p-5 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
          <div className="h-7 bg-gray-200 rounded w-3/4" />
        </div>
      ))}
    </div>
  );

  const topCategory = summary.byCategory?.[0];

  const cards = [
    { label: 'Total Spent', value: `₹${summary.totalSpent?.toLocaleString('en-IN') || 0}`, icon: '💰' },
    { label: 'This Month', value: `₹${summary.thisMonth?.toLocaleString('en-IN') || 0}`, icon: '📅' },
    { label: 'Top Category', value: topCategory ? `${topCategory.category} (₹${topCategory.total?.toLocaleString('en-IN')})` : '—', icon: '📊' },
    { label: 'Transactions', value: summary.byCategory?.reduce((s, c) => s + c.count, 0) || 0, icon: '🧾' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(card => (
        <div key={card.label} className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <span>{card.icon}</span>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{card.label}</p>
          </div>
          <p className="text-xl font-semibold text-gray-900 truncate">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
