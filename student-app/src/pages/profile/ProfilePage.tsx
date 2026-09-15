import { Bell, LogOut, PencilLine, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export function ProfilePage() {
  const navigate = useNavigate();
  const { currentStudent } = useAppContext();
  const { logout } = useAuth();

  if (!currentStudent) {
    return null;
  }

  return (
    <div className="mx-auto max-w-md space-y-5 pb-24 pt-6">
      <div className="rounded-3xl bg-slate-900 p-5 text-white shadow-[0_20px_40px_rgba(15,23,42,0.24)]">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold">
            {currentStudent.name.charAt(0)}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Student</p>
            <h1 className="mt-1 text-xl font-bold">{currentStudent.name}</h1>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="space-y-3 text-sm text-slate-700">
          <div className="flex items-center justify-between"><span>Department</span><span className="font-medium text-slate-900">{currentStudent.department}</span></div>
          <div className="flex items-center justify-between"><span>Faculty</span><span className="font-medium text-slate-900">{currentStudent.faculty}</span></div>
          <div className="flex items-center justify-between"><span>Level</span><span className="font-medium text-slate-900">{currentStudent.level}</span></div>
          <div className="flex items-center justify-between"><span>Phone</span><span className="font-medium text-slate-900">{currentStudent.phone}</span></div>
          <div className="flex items-center justify-between"><span>Email</span><span className="font-medium text-slate-900">{currentStudent.email}</span></div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="space-y-2 text-sm">
          <button type="button" className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left hover:bg-slate-50">
            <span className="flex items-center gap-3"><PencilLine size={16} className="text-slate-500" />Edit Profile</span>
          </button>
          <button type="button" className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left hover:bg-slate-50">
            <span className="flex items-center gap-3"><Bell size={16} className="text-slate-500" />Notification Settings</span>
          </button>
          <button type="button" className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left hover:bg-slate-50">
            <span className="flex items-center gap-3"><ShieldCheck size={16} className="text-slate-500" />Help</span>
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-rose-600 hover:bg-rose-50"
            onClick={() => {
              logout();
              navigate('/auth');
            }}
          >
            <span className="flex items-center gap-3"><LogOut size={16} />Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
