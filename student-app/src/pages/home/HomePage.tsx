import { ArrowRight, MapPin, Navigation, Route } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useAppContext } from '../../context/AppContext';
import { groupService } from '../../services/groupService';

export function HomePage() {
  const navigate = useNavigate();
  const { selectedPickup, setSelectedPickup, selectedDestination, setSelectedDestination, availableLocations, groups, setCurrentGroup, currentStudent } = useAppContext();
  const [loading, setLoading] = useState(false);

  const matchingGroups = useMemo(
    () =>
      groups.filter(
        (group) =>
          group.pickup === selectedPickup && group.destination === selectedDestination,
      ),
    [groups, selectedPickup, selectedDestination],
  );

  const handleFindRide = async () => {
    setLoading(true);
    const results = await groupService.getMatchingGroups(selectedPickup, selectedDestination);
    setLoading(false);

    if (results.length > 0) {
      setCurrentGroup(results[0]);
    }

    navigate('/groups');
  };

  return (
    <div className="mx-auto max-w-md space-y-5 pb-24 pt-6">
      <div className="rounded-[28px] bg-slate-900 p-5 text-white shadow-[0_18px_40px_rgba(15,23,42,0.25)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Welcome</p>
            <h1 className="mt-2 text-2xl font-bold">Where are you going?</h1>
          </div>
          <div className="rounded-xl bg-white/10 p-2">
            <Navigation size={18} />
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-left text-xs font-medium text-slate-300">
            FROM
            <select
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 text-sm text-white outline-none focus:border-sky-400"
              value={selectedPickup}
              onChange={(event) => setSelectedPickup(event.target.value)}
            >
              {availableLocations.map((location) => (
                <option key={location.id} value={location.name}>
                  {location.name}
                </option>
              ))}
            </select>
          </label>

          <div className="flex justify-center text-slate-400">
            <Route size={18} />
          </div>

          <label className="block text-left text-xs font-medium text-slate-300">
            TO
            <select
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 text-sm text-white outline-none focus:border-sky-400"
              value={selectedDestination}
              onChange={(event) => setSelectedDestination(event.target.value)}
            >
              {availableLocations.map((location) => (
                <option key={location.id} value={location.name}>
                  {location.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <Button fullWidth onClick={handleFindRide} className="mt-5" disabled={loading}>
          {loading ? 'Finding rides...' : 'Find a Ride'}
          {!loading ? <ArrowRight size={16} /> : null}
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Nearby</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">Pending groups near you</h2>
          </div>
          <MapPin size={17} className="text-sky-600" />
        </div>

        {matchingGroups.length > 0 ? (
          <div className="space-y-3">
            {matchingGroups.slice(0, 2).map((group) => {
              const waitingCount = Math.max(0, group.totalSeats - group.members.length);
              return (
                <div key={group.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-900">
                    <span>{group.pickup} → {group.destination}</span>
                    <span className="text-sky-700">{group.members.length}/{group.totalSeats}</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Created {new Date(group.createdAt).toLocaleDateString(undefined, { hour: 'numeric', minute: '2-digit' })}
                  </p>
                  <p className="mt-2 text-xs text-slate-600">
                    Waiting for {waitingCount} passenger{waitingCount === 1 ? '' : 's'}
                  </p>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!currentStudent) return;
                      const updated = await groupService.joinGroup(currentStudent, group.id);
                      setCurrentGroup(updated);
                      navigate('/groups');
                    }}
                    className="mt-3 w-full rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white"
                  >
                    Join Group
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
            <p className="font-medium text-slate-800">No groups yet</p>
            <p className="mt-1 text-sm text-slate-500">Be the first person going this route.</p>
          </div>
        )}
      </div>
    </div>
  );
}
