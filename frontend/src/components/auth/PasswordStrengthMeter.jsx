export default function PasswordStrengthMeter({ password }) {
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password)
  };

  const score = Object.values(checks).filter(Boolean).length;
  const levels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-500'];
  const textColors = ['', 'text-red-500', 'text-orange-400', 'text-yellow-500', 'text-emerald-500'];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              score >= i ? colors[score] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      {score > 0 && (
        <p className={`text-xs font-medium ${textColors[score]}`}>
          {levels[score]}
        </p>
      )}
      <ul className="space-y-1 mt-2">
        {[
          { key: 'length', label: 'At least 8 characters' },
          { key: 'upper', label: 'One uppercase letter' },
          { key: 'number', label: 'One number' },
          { key: 'special', label: 'One special character (!@#$%^&*)' }
        ].map(({ key, label }) => (
          <li key={key} className={`flex items-center gap-1.5 text-xs ${checks[key] ? 'text-emerald-600' : 'text-gray-400'}`}>
            <span>{checks[key] ? '✓' : '○'}</span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
