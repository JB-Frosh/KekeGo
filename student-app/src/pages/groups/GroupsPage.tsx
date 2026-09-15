import { useMemo, useState } from 'react';
import { Clock3, Plus, Users, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAppContext } from '../../context/AppContext';
import { groupService } from '../../services/groupService';

export function GroupsPage() {
  const navigate = useNavigate();
  const { groups, currentStudent, selectedPickup, selectedDestination, setCurrentGroup } = useAppContext();
  const [joiningGroupId, setJoiningGroupId] = useState<string | null>(null);

  const matchingGroups = useMemo(
    () =>
      groups.filter(
        (group) => group.pickup === selectedPickup && group.destination === selectedDestination,
      ),
    [groups, selectedPickup, selectedDestination],
  );

  const handleJoin = async (groupId: string) => {
    if (!currentStudent) return;
    setJoiningGroupId(groupId);
    const updatedGroup = await groupService.joinGroup(currentStudent, groupId);
    setCurrentGroup(updatedGroup);
    setJoiningGroupId(null);
    navigate('/status');
  };

  return (
    <div className="mx-auto max-w-md space-y-5 pb-24 pt-6">
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Route</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {selectedPickup} → {selectedDestination}
            </h2>
          </div>
          <Badge tone="info">{matchingGroups.length} groups</Badge>
        </div>
      </div>

      {matchingGroups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">No groups yet</p>
          <p className="mt-2 text-sm text-slate-500">Be the first person going this route.</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => navigate('/groups/create')}
            icon={<Plus size={16} />}
          >
            Create New Group
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {matchingGroups.map((group) => {
            const waiting = Math.max(0, group.totalSeats - group.members.length);
            return (
              <div key={group.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900">{group.pickup} → {group.destination}</h3>
                  <Badge tone={group.members.length >= 4 ? 'success' : 'warning'}>
                    {group.members.length}/{group.totalSeats}
                  </Badge>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <Clock3 size={14} />
                  Created {new Date(group.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                  <Users size={16} className="text-sky-600" />
                  Waiting for {waiting} passenger{waiting === 1 ? '' : 's'}
                </div>

                <Button
                  fullWidth
                  variant="primary"
                  className="mt-4"
                  onClick={() => handleJoin(group.id)}
                  disabled={joiningGroupId === group.id}
                  icon={joiningGroupId === group.id ? <CheckCircle2 size={16} /> : null}
                >
                  {joiningGroupId === group.id ? 'Joining...' : 'Join Group'}
                </Button>
              </div>
            );
          })}

          <Button
            fullWidth
            variant="outline"
            onClick={() => navigate('/groups/create')}
            icon={<Plus size={16} />}
          >
            Create New Group
          </Button>
        </div>
      )}
    </div>
  );
}
