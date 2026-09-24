import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, Eye, EyeOff, User, Phone, CreditCard, Fingerprint, Copy, CheckCircle2, MapPin, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

// Role → dashboard path mapping (shared across the app)
const ROLE_DASHBOARD_MAP = {
  admin: '/',
  associate: '/associate',
  client: '/client',
  accounts: '/accounts',
};

const Login = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const navigate = useNavigate();
  const { user } = useAuth();

  // ── If user is already logged in, redirect to their correct panel ──
  useEffect(() => {
    if (user && user.role) {
      const role = user.role.toLowerCase();
      const dashboard = ROLE_DASHBOARD_MAP[role];
      if (dashboard) {
        navigate(dashboard, { replace: true });
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-navy-dark to-gray-900 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-5">
          <div className="w-14 h-14 bg-navy rounded-2xl flex items-center justify-center mb-3">
            <Building2 className="text-gold" size={28} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">DEVOJAS REALTORS</h1>
          <p className="text-sm text-gray-400">{mode === 'login' ? 'Panel Login' : 'Associate Sign Up'}</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${mode === 'login' ? 'bg-white shadow text-navy' : 'text-gray-500'}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${mode === 'signup' ? 'bg-white shadow text-navy' : 'text-gray-500'}`}
            onClick={() => setMode('signup')}
          >
            Sign Up as Associate
          </button>
        </div>

        {mode === 'login' ? (
          <LoginForm navigate={navigate} switchToSignup={() => setMode('signup')} />
        ) : (
          <AssociateSignupForm
            onDone={(loginId) => {
              setMode('login');
            }}
          />
        )}
      </div>
    </div>
  );
};

// -------------------- LOGIN --------------------
const LoginForm = ({ navigate, switchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Clear any stale session before logging in
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      const result = await login(email.trim(), password);
      const role = result?.user?.role?.toLowerCase();

      const dashboard = ROLE_DASHBOARD_MAP[role];

      if (!dashboard) {
        setError(`Invalid user role received: ${result?.user?.role}`);
        return;
      }

      navigate(dashboard, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Email or Phone</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-10"
              placeholder="Email, phone or Login ID"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-10 pr-10"
              placeholder="Enter your password"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 disabled:opacity-60">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="text-sm text-center mt-6 text-gray-500">
        New Associate?{' '}
        <button onClick={switchToSignup} className="text-navy font-semibold hover:underline">
          Sign up here
        </button>
      </p>
    </>
  );
};

// -------------------- ASSOCIATE SIGNUP --------------------
const AssociateSignupForm = ({ onDone }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    pan_number: '',
    aadhar_number: '',
    address: '',
    password: '',
    confirm_password: '',
    sponsor_code: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend validation
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirm_password) {
      setError('Password and Confirm Password do not match');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/register-associate', form);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (result) {
    const loginId = result.data?.login_id || result.user?.login_id || result.user?.email || result.user?.phone;
    return (
      <div className="text-center space-y-4">
        <CheckCircle2 className="mx-auto text-green-500" size={44} />
        <h2 className="text-lg font-bold text-gray-800">Associate Account Created!</h2>
        <p className="text-sm text-gray-500">
          Please save your login details below. Use your email, phone, or Login ID to log in.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left space-y-2">
          <Row label="Login ID" value={loginId} />
          <Row label="Referral Code" value={result.data?.referral_code || result.user?.referral_code} />
          {result.data?.sponsor && (
            <Row label="Sponsor" value={`${result.data.sponsor.name} (${result.data.sponsor.login_id})`} />
          )}
          <Row label="Fixed Commission" value="5%" />
        </div>

        {copied && <p className="text-xs text-green-600">Copied!</p>}

        <button onClick={() => onDone(loginId)} className="btn-primary w-full py-2.5">
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <>
      <p className="text-xs text-gray-500 mb-4 -mt-2">
        Create your associate account. Commission is fixed at 5%.
      </p>
      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <IconInput icon={User} name="name" placeholder="Full Name *" value={form.name} onChange={handleChange} required />
        <IconInput icon={Phone} name="phone" placeholder="Phone Number *" value={form.phone} onChange={handleChange} required />
        <IconInput icon={Mail} name="email" type="email" placeholder="Email (optional but recommended)" value={form.email} onChange={handleChange} />
        <IconInput icon={MapPin} name="address" placeholder="Address (optional)" value={form.address} onChange={handleChange} />

        <div className="pt-1 border-t border-gray-100" />
        <IconInput icon={CreditCard} name="pan_number" placeholder="PAN Number *" value={form.pan_number} onChange={handleChange} required />
        <IconInput icon={Fingerprint} name="aadhar_number" placeholder="Aadhar Number *" value={form.aadhar_number} onChange={handleChange} required />

        <div className="pt-1 border-t border-gray-100" />
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            className="input-field pl-10 pr-10"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password (min 6 characters) *"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <IconInput icon={Lock} name="confirm_password" type="password" placeholder="Confirm Password *" value={form.confirm_password} onChange={handleChange} required />

        <div className="pt-1 border-t border-gray-100" />
        <IconInput icon={Users} name="sponsor_code" placeholder="Sponsor Code (optional)" value={form.sponsor_code} onChange={handleChange} />

        <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 disabled:opacity-60 mt-2">
          {loading ? 'Creating account...' : 'Create Associate Account'}
        </button>
      </form>
    </>
  );
};

const IconInput = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
    <input className="input-field pl-10" {...props} />
  </div>
);

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="font-semibold text-gray-800">{value || '-'}</span>
  </div>
);

export default Login;
