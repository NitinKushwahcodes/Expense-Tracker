export default function ErrorToast({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
      <span className="mt-0.5">⚠️</span>
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-red-400 hover:text-red-600 ml-2 font-bold">×</button>
      )}
    </div>
  );
}
