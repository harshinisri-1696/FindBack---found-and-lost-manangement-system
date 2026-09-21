import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { validateLogin } from '../../utils/validation';
import { 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import { LostFoundLogo } from '../common/LostFoundLogo';

export const LoginPage: React.FC = () => {
  const { loginUser, users, setCurrentView, showToast } = useApp();

  // Auto-filled credentials so clicking Sign In logs in immediately
  const [identifier, setIdentifier] = useState('USER104');
  const [password, setPassword] = useState('Campus@2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ensure fields always stay filled on mount if empty
  useEffect(() => {
    if (!identifier) setIdentifier('USER104');
    if (!password) setPassword('Campus@2026');
  }, []);

  const executeLogin = (userIdentifier: string, userPass: string) => {
    // If identifier or password was somehow blank, fallback to auto-fill defaults
    const idToUse = userIdentifier.trim() || 'USER104';
    const passToUse = userPass || 'Campus@2026';

    const validationErrors = validateLogin(idToUse, passToUse);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    const trimmedId = idToUse.trim().toLowerCase();
    const foundUser = users.find(u => 
      u.email.toLowerCase() === trimmedId || 
      u.college_id.toLowerCase() === trimmedId
    );

    if (!foundUser) {
      setIsSubmitting(false);
      setErrors({ identifier: 'No account registered with this User ID or Email.' });
      return;
    }

    if (foundUser.status === 'suspended') {
      setIsSubmitting(false);
      setErrors({ identifier: 'This campus account is suspended. Please contact the Helpdesk.' });
      return;
    }

    loginUser(foundUser);
    showToast(`Welcome back, ${foundUser.name}!`, 'success');
    setCurrentView('dashboard');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalId = identifier.trim() || 'USER104';
    const finalPass = password || 'Campus@2026';
    if (!identifier) setIdentifier('USER104');
    if (!password) setPassword('Campus@2026');
    executeLogin(finalId, finalPass);
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-blue-50/60 border border-blue-100 shadow-2xs">
            <LostFoundLogo className="w-14 h-14" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Access your campus account to report lost belongings, browse found items, and track recovery claims
          </p>
        </div>

        {/* Clean Login Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/40 p-6 sm:p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User ID input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                User ID or Email
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={identifier}
                  onChange={e => {
                    setIdentifier(e.target.value);
                    if (errors.identifier) setErrors({ ...errors, identifier: '' });
                  }}
                  placeholder="Enter User ID or Email"
                  autoComplete="username"
                  className={`w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border ${
                    errors.identifier ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-slate-50/50 focus:bg-white'
                  } focus:ring-2 focus:ring-[#4169E1] focus:outline-hidden transition`}
                />
              </div>
              {errors.identifier && (
                <p className="text-[11px] text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.identifier}
                </p>
              )}
            </div>

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => showToast('Password reset guidance dispatched to your registered email.', 'info')}
                  className="text-[11px] font-medium text-[#4169E1] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className={`w-full text-xs pl-10 pr-10 py-3 rounded-xl border ${
                    errors.password ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-slate-50/50 focus:bg-white'
                  } focus:ring-2 focus:ring-[#4169E1] focus:outline-hidden transition`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.password}
                </p>
              )}
            </div>

            {/* Remember me option */}
            <div className="flex items-center justify-between text-xs text-slate-600 pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#4169E1] focus:ring-[#4169E1] border-slate-300"
                />
                <span>Keep me signed in</span>
              </label>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-slate-400" /> Secure Campus Login
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#4169E1] hover:bg-[#1E3A8A] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Registration link */}
          <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
            Don't have an account yet?{' '}
            <button
              onClick={() => setCurrentView('register')}
              className="font-bold text-[#4169E1] hover:underline cursor-pointer"
            >
              Register Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
