import { CalendarDays, Clock3, MapPinned, UserRound } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { tripService } from '../../services/tripService';
import { Badge } from '../../components/ui/Badge';

export function TripsPage() {
  const { currentTrip } = useAppContext();
  const trips = tripService.getTrips();

  return (
    <div className="mx-auto max-w-md space-y-4 pb-24 pt-6">
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Trips</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Your rides</h1>
      </div>

      <div className="space-y-3">
        {[...(currentTrip ? [currentTrip] : []), ...trips].slice(0, 4).map((trip) => (
          <div key={trip.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-slate-900">{trip.pickup} → {trip.destination}</p>
                <p className="mt-1 text-xs text-slate-500">{trip.id}</p>
              </div>
              <Badge tone={trip.status === 'COMPLETED' ? 'success' : 'info'}>{trip.status}</Badge>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CalendarDays size={14} className="text-slate-400" />
                {new Date(trip.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Clock3 size={14} className="text-slate-400" />
                {new Date(trip.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </div>
              <div className="flex items-center gap-2">
                <UserRound size={14} className="text-slate-400" />
                {trip.driver.name}
              </div>
              <div className="flex items-center gap-2">
                <MapPinned size={14} className="text-slate-400" />
                {trip.passengers} passengers
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
