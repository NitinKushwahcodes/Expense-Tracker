import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PasswordStrengthMeter from '../components/auth/PasswordStrengthMeter';
import ErrorToast from '../components/shared/ErrorToast';

const generateSuggestions = (base) => {
  if (base.length < 2) return [];
  const clean = base.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return [
    `${clean}_2025`,
    `${clean}.dev`,
    `${clean}_official`
  ];
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setFieldErrors(fe => ({ ...fe, [k]: '' }));
    setError('');
  };

  const passwordValid = () => {
    const p = form.password;
    return p.length >= 8 && /[A-Z]/.test(p) && /[0-9]/.test(p) && /[!@#$%^&*]/.test(p);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      await register(form.username, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      if (err.isNetworkError) {
        setError('Unable to connect to server. Please check your internet connection or try again later.');
      } else {
        const msg = err.response?.data?.error || 'Registration failed. Please try again.';
        if (msg.toLowerCase().includes('email')) {
          setFieldErrors(fe => ({ ...fe, email: msg }));
        } else if (msg.toLowerCase().includes('username')) {
          setFieldErrors(fe => ({ ...fe, username: msg }));
        } else {
          setError(msg);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const suggestions = generateSuggestions(form.username);
  const usernameValid = /^[a-zA-Z0-9_]{3,30}$/.test(form.username);
  const usernameInvalid = form.username.length > 0 && !usernameValid;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl font-bold">₹</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Start tracking your expenses</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && <div className="mb-4"><ErrorToast message={error} onClose={() => setError('')} /></div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={form.username}
                  onChange={e => set('username', e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder="e.g. nitin_dev"
                  required
                  className={`w-full border rounded-lg px-3 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    usernameInvalid || fieldErrors.username ? 'border-red-400' : usernameValid ? 'border-emerald-400' : 'border-gray-300'
                  }`}
                />
                {form.username && (
                  <span className="absolute right-3 top-2.5 text-sm">
                    {usernameValid ? '✅' : '❌'}
                  </span>
                )}
              </div>
              {usernameInvalid && (
                <p className="text-xs text-red-500 mt-1">
                  {form.username.length < 3 ? 'At least 3 characters required' : 'Only letters, numbers, and underscores allowed'}
                </p>
              )}
              {fieldErrors.username && <p className="text-xs text-red-500 mt-1">{fieldErrors.username}</p>}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  {suggestions.map(s => (
                    <button
                      key={s}
                      type="button"
                      onMouseDown={() => set('username', s)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="you@example.com"
                  required
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    fieldErrors.email ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
              </div>
              {form.email.includes('gmail') && !form.email.includes('@') && (
                <p className="text-xs text-amber-500 mt-1">Did you mean youremail@gmail.com?</p>
              )}
              {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="Min 8 chars, uppercase, number, symbol"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-sm"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              <PasswordStrengthMeter password={form.password} />
            </div>

            <button
              type="submit"
              disabled={loading || !passwordValid() || !usernameValid}
              className="w-full bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
