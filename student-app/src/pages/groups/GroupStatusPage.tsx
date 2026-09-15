import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CarFront, Check, Clock3, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAppContext } from '../../context/AppContext';
import { groupService } from '../../services/groupService';
import { tripService } from '../../services/tripService';

export function GroupStatusPage() {
  const navigate = useNavigate();
  const { currentGroup, setCurrentGroup, currentTrip, setCurrentTrip, currentStudent } = useAppContext();
  const [statusMessage, setStatusMessage] = useState('Waiting for more passengers');

  useEffect(() => {
    if (!currentGroup) return;

    const waiting = Math.max(0, currentGroup.totalSeats - currentGroup.members.length);
    setStatusMessage(
      waiting > 0 ? `Waiting for ${waiting} more passenger${waiting === 1 ? '' : 's'}` : 'Your group is full!'
    );
  }, [currentGroup]);

  const seats = useMemo(
    () => Array.from({ length: 4 }, (_, index) => index < (currentGroup?.members.length ?? 0)),
    [currentGroup],
  );

  useEffect(() => {
    if (!currentGroup) return;

    if (currentGroup.status === 'FULL' && !currentTrip) {
      const timer = window.setTimeout(() => {
        const trip = tripService.createTripForGroup(currentGroup);
        setCurrentTrip(trip);
        setCurrentGroup({ ...currentGroup, status: 'SEARCHING_DRIVER' });
        groupService.updateGroupStatus(currentGroup.id, 'SEARCHING_DRIVER');
      }, 1800);

      return () => window.clearTimeout(timer);
    }
  }, [currentGroup, currentTrip, setCurrentGroup, setCurrentTrip]);

  if (!currentGroup) {
    return (
      <div className="mx-auto max-w-md pt-10 text-center">
        <p className="text-lg font-semibold text-slate-800">No active group found.</p>
      </div>
    );
  }

  const handleCancel = () => {
    if (!currentStudent) return;
    setCurrentGroup(null);
    navigate('/home');
  };

  return (
    <div className="mx-auto max-w-md space-y-5 pb-24 pt-6">
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Group</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">{currentGroup.pickup} → {currentGroup.destination}</h1>
          </div>
          <Badge tone={currentGroup.status === 'FULL' ? 'success' : 'warning'}>{currentGroup.id}</Badge>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
          <span>{currentGroup.members.length} / {currentGroup.totalSeats} passengers</span>
          <span>{currentGroup.status}</span>
        </div>

        <div className="mt-5 space-y-2">
          {seats.map((filled, index) => (
            <div key={index} className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm">
              {filled ? <Check className="text-emerald-500" size={16} /> : <Clock3 className="text-slate-400" size={16} />}
              <span className="flex-1 text-slate-700">{currentGroup.members[index]?.name ?? 'Waiting'}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50 p-3">
          <p className="text-lg font-semibold text-slate-900">{statusMessage}</p>
          <p className="mt-2 text-sm text-slate-600">
            Your group will be sent to a driver when all 4 seats are filled.
          </p>
        </div>

        {currentGroup.status === 'FULL' ? (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertCircle size={18} />
              <span className="font-semibold">Finding an available keke driver...</span>
            </div>
            <div className="mt-3 flex gap-2">
              <div className="h-2 w-8 animate-pulse rounded-full bg-amber-400" />
              <div className="h-2 w-8 animate-pulse rounded-full bg-amber-300" />
              <div className="h-2 w-8 animate-pulse rounded-full bg-amber-200" />
            </div>
          </div>
        ) : null}

        {currentTrip ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Driver</p>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">{currentTrip.driver.name}</p>
                <p className="text-sm text-slate-600">{currentTrip.driver.plateNumber}</p>
              </div>
              <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                <CarFront size={18} />
              </div>
            </div>
          </div>
        ) : null}

        <Button variant="outline" className="mt-5 w-full" onClick={handleCancel} icon={<XCircle size={16} />}>
          Cancel Request
        </Button>
      </div>
    </div>
  );
}
