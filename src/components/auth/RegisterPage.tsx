import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  validateRegistration, 
  checkPasswordStrength 
} from '../../utils/validation';
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle,
  ShieldCheck,
  Check
} from 'lucide-react';
import { UserRole } from '../../types';
import { LostFoundLogo } from '../common/LostFoundLogo';

export const RegisterPage: React.FC = () => {
  const { users, loginUser, setCurrentView, showToast } = useApp();

  const [name, setName] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [department, setDepartment] = useState('Information Technology');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordStrength = checkPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateRegistration({
      name,
      college_id: collegeId,
      email,
      phone,
      password,
      confirm_password: confirmPassword,
    });

    if (users.some(u => u.college_id.toLowerCase() === collegeId.trim().toLowerCase())) {
      validationErrors.college_id = 'This User ID is already registered.';
    }
    if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
      validationErrors.email = 'This email address is already associated with an account.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast('Please correct the highlighted form errors.', 'error');
      return;
    }

    const newUser = {
      user_id: `usr_${Date.now()}`,
      name: name.trim(),
      college_id: collegeId.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role,
      status: 'active' as const,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      department,
    };

    loginUser(newUser);
    showToast('Campus account created successfully!', 'success');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-blue-50/60 border border-blue-100 shadow-2xs">
            <LostFoundLogo className="w-14 h-14" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Register Account
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create an account to report lost belongings and track recovery claims
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/40 p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Type Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    role === 'student'
                      ? 'bg-[#E8F0FF] border-[#4169E1] text-[#4169E1]'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('faculty')}
                  className={`py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    role === 'faculty'
                      ? 'bg-[#E8F0FF] border-[#4169E1] text-[#4169E1]'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Faculty / Staff</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => {
                      setName(e.target.value);
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    placeholder="e.g. Rohan Sharma"
                    className={`w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border ${errors.name ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-slate-50/40 focus:bg-white'} focus:ring-2 focus:ring-[#4169E1] focus:outline-hidden transition`}
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              {/* User ID */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  User ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={collegeId}
                    onChange={e => {
                      setCollegeId(e.target.value.toUpperCase());
                      if (errors.college_id) setErrors({ ...errors, college_id: '' });
                    }}
                    placeholder={role === 'student' ? 'e.g. USER104' : 'e.g. FAC082'}
                    className={`w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border ${errors.college_id ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-slate-50/40 focus:bg-white'} focus:ring-2 focus:ring-[#4169E1] focus:outline-hidden transition`}
                  />
                </div>
                {errors.college_id && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.college_id}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    placeholder="name@college.edu"
                    className={`w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border ${errors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-slate-50/40 focus:bg-white'} focus:ring-2 focus:ring-[#4169E1] focus:outline-hidden transition`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Phone Number (10 Digits) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors({ ...errors, phone: '' });
                    }}
                    placeholder="9876543210"
                    maxLength={10}
                    className={`w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border ${errors.phone ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-slate-50/40 focus:bg-white'} focus:ring-2 focus:ring-[#4169E1] focus:outline-hidden transition`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Department / Branch
              </label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50/40 focus:bg-white focus:ring-2 focus:ring-[#4169E1] focus:outline-hidden transition"
              >
                <option value="Information Technology">Information Technology</option>
                <option value="Computer Science & Engineering">Computer Science &amp; Engineering</option>
                <option value="Electronics & Communication">Electronics &amp; Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Electrical & Electronics">Electrical &amp; Electronics</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Administrative Staff">Administrative Staff</option>
              </select>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    placeholder="Min 6 characters"
                    className={`w-full text-xs pl-10 pr-10 py-2.5 rounded-xl border ${errors.password ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-slate-50/40 focus:bg-white'} focus:ring-2 focus:ring-[#4169E1] focus:outline-hidden transition`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirm_password) setErrors({ ...errors, confirm_password: '' });
                    }}
                    placeholder="Re-enter password"
                    className={`w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border ${errors.confirm_password ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-slate-50/40 focus:bg-white'} focus:ring-2 focus:ring-[#4169E1] focus:outline-hidden transition`}
                  />
                </div>
                {errors.confirm_password && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.confirm_password}
                  </p>
                )}
              </div>
            </div>

            {/* Password Strength Meter */}
            {password && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-600">Password Security Strength:</span>
                  <span style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1.5">
                  {[1, 2, 3, 4].map(step => (
                    <div
                      key={step}
                      className="rounded-full transition-all"
                      style={{
                        backgroundColor: passwordStrength.score >= step ? passwordStrength.color : '#e2e8f0'
                      }}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500 pt-1">
                  <span className={passwordStrength.hasLength ? 'text-emerald-700 font-semibold' : ''}>
                    ✓ At least 8 characters
                  </span>
                  <span className={passwordStrength.hasLower && passwordStrength.hasUpper ? 'text-emerald-700 font-semibold' : ''}>
                    ✓ Upper &amp; lowercase letters
                  </span>
                  <span className={passwordStrength.hasNumber ? 'text-emerald-700 font-semibold' : ''}>
                    ✓ Contains numerals (0-9)
                  </span>
                  <span className={passwordStrength.hasSpecial ? 'text-emerald-700 font-semibold' : ''}>
                    ✓ Special character (!@#$)
                  </span>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-[#4169E1] hover:bg-[#1E3A8A] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 mt-4 cursor-pointer active:scale-[0.99]"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Already registered?{' '}
            <button
              onClick={() => setCurrentView('login')}
              className="font-bold text-[#4169E1] hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
