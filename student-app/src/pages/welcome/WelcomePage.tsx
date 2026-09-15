import { ArrowRight, CarFront, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md rounded-[32px] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
            <CarFront size={28} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">KekeGo</p>
            <h1 className="text-2xl font-bold text-slate-900">Campus shuttle</h1>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 text-center">
          <p className="text-sm text-slate-600">
            Ride together with students heading to the same campus destination.
          </p>
        </div>

        <div className="mt-6 space-y-3 text-sm text-slate-600">
          <div className="flex items-center gap-3 rounded-xl bg-sky-50 px-3 py-2 text-sky-700">
            <ShieldCheck size={16} />
            Group-first matching for safe rides
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2">
            <CarFront size={16} className="text-slate-500" />
            Real campus routes, mock-ready flow
          </div>
        </div>

        <Button fullWidth className="mt-6" onClick={() => navigate('/auth')}>
          Get Started
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
