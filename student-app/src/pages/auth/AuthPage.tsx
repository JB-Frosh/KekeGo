import { useMemo, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import type { RegisterPayload } from '../../types';

const initialRegister: RegisterPayload = {
  fullName: '',
  department: '',
  faculty: '',
  level: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const initialLogin = { emailOrPhone: '', password: '' };

export function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setCurrentStudent } = useAppContext();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [registerForm, setRegisterForm] = useState<RegisterPayload>(initialRegister);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  const fieldErrors = useMemo(() => {
    if (mode === 'login') {
      return {
        emailOrPhone: loginForm.emailOrPhone.trim() ? '' : 'Email or phone is required',
        password: loginForm.password.trim() ? '' : 'Password is required',
      };
    }

    return {
      fullName: registerForm.fullName.trim() ? '' : 'Full name is required',
      department: registerForm.department.trim() ? '' : 'Department is required',
      faculty: registerForm.faculty.trim() ? '' : 'Faculty is required',
      level: registerForm.level.trim() ? '' : 'Level is required',
      phone: registerForm.phone.trim() ? '' : 'Phone number is required',
      email: registerForm.email.trim() ? '' : 'Email is required',
      password: registerForm.password.trim() ? '' : 'Password is required',
      confirmPassword:
        registerForm.confirmPassword.trim() && registerForm.confirmPassword === registerForm.password
          ? ''
          : 'Please confirm your password',
    };
  }, [mode, loginForm, registerForm]);

  const handleLogin = async () => {
    if (!loginForm.emailOrPhone.trim() || !loginForm.password.trim()) {
      setStatus({ type: 'error', message: 'Please fill in your email/phone and password.' });
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: 'idle', message: '' });
      const student = await authService.login(loginForm);
      login(student);
      setCurrentStudent(student);
      setStatus({ type: 'success', message: 'Login successful. Redirecting...' });
      navigate('/home');
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Login failed.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    const hasErrors = Object.values(fieldErrors).some(Boolean);

    if (hasErrors) {
      setStatus({ type: 'error', message: 'Please complete all registration details correctly.' });
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: 'idle', message: '' });
      const student = await authService.register(registerForm);
      login(student);
      setCurrentStudent(student);
      setStatus({ type: 'success', message: 'Registration successful. Welcome aboard!' });
      navigate('/home');
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Registration failed.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-md rounded-[28px] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">KekeGo</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">Campus ride access</h1>
          </div>
          <div className="rounded-2xl bg-sky-100 p-2 text-sky-700">
            <ShieldCheck size={22} />
          </div>
        </div>

        <div className="mb-6 flex overflow-hidden rounded-2xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 rounded-xl px-2 py-2 text-sm font-semibold ${mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 rounded-xl px-2 py-2 text-sm font-semibold ${mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            Register
          </button>
        </div>

        {status.type !== 'idle' ? (
          <div
            className={`mb-4 flex items-start gap-2 rounded-xl border px-3 py-2 text-sm ${
              status.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-rose-200 bg-rose-50 text-rose-700'
            }`}
          >
            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{status.message}</span>
          </div>
        ) : null}

        {mode === 'login' ? (
          <div className="space-y-4">
            <Input
              label="Email or Phone"
              placeholder="quadri@student.edu"
              value={loginForm.emailOrPhone}
              onChange={(event) =>
                setLoginForm((current) => ({ ...current, emailOrPhone: event.target.value }))
              }
              error={fieldErrors.emailOrPhone}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={loginForm.password}
              onChange={(event) =>
                setLoginForm((current) => ({ ...current, password: event.target.value }))
              }
              error={fieldErrors.password}
            />

            <Button fullWidth onClick={handleLogin} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
              {!loading ? <ArrowRight size={16} /> : null}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              label="Full name"
              placeholder="Quadri Adebayo"
              value={registerForm.fullName}
              onChange={(event) =>
                setRegisterForm((current) => ({ ...current, fullName: event.target.value }))
              }
              error={fieldErrors.fullName}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Department"
                placeholder="Computer Engineering"
                value={registerForm.department}
                onChange={(event) =>
                  setRegisterForm((current) => ({ ...current, department: event.target.value }))
                }
                error={fieldErrors.department}
              />
              <Input
                label="Faculty"
                placeholder="Engineering"
                value={registerForm.faculty}
                onChange={(event) =>
                  setRegisterForm((current) => ({ ...current, faculty: event.target.value }))
                }
                error={fieldErrors.faculty}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Level"
                placeholder="300 Level"
                value={registerForm.level}
                onChange={(event) =>
                  setRegisterForm((current) => ({ ...current, level: event.target.value }))
                }
                error={fieldErrors.level}
              />
              <Input
                label="Phone"
                placeholder="+2348012345678"
                value={registerForm.phone}
                onChange={(event) =>
                  setRegisterForm((current) => ({ ...current, phone: event.target.value }))
                }
                error={fieldErrors.phone}
              />
            </div>
            <Input
              label="Email"
              type="email"
              placeholder="quadri@student.edu"
              value={registerForm.email}
              onChange={(event) =>
                setRegisterForm((current) => ({ ...current, email: event.target.value }))
              }
              error={fieldErrors.email}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={registerForm.password}
              onChange={(event) =>
                setRegisterForm((current) => ({ ...current, password: event.target.value }))
              }
              error={fieldErrors.password}
            />
            <Input
              label="Confirm password"
              type="password"
              placeholder="••••••••"
              value={registerForm.confirmPassword}
              onChange={(event) =>
                setRegisterForm((current) => ({ ...current, confirmPassword: event.target.value }))
              }
              error={fieldErrors.confirmPassword}
            />

            <Button fullWidth onClick={handleRegister} disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
              {!loading ? <ArrowRight size={16} /> : null}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
