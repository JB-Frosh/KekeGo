import { useMemo, useState } from 'react';
import { CreditCard, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useAppContext } from '../../context/AppContext';
import { groupService } from '../../services/groupService';
import { paymentService } from '../../services/paymentService';

export function CreateGroupPage() {
  const navigate = useNavigate();
  const { currentStudent, selectedPickup, selectedDestination, setCurrentGroup, setCurrentTrip } = useAppContext();
  const [isCreating, setIsCreating] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);

  const waitingPassengers = useMemo(() => 3, []);

  const handleCreateGroup = async () => {
    if (!currentStudent) return;
    setIsCreating(true);
    const group = await groupService.createGroup(currentStudent, selectedPickup, selectedDestination);
    setCurrentGroup(group);
    setIsCreating(false);
    navigate('/status');
  };

  const handlePayForFourSeats = async () => {
    if (!currentStudent) return;
    setShowPayment(true);
  };

  const handlePayment = async () => {
    if (!currentStudent) return;
    const payment = await paymentService.processPayment(`${selectedPickup} → ${selectedDestination}`, 4000);
    if (payment.status === 'SUCCESS') {
      const group = await groupService.createGroup(currentStudent, selectedPickup, selectedDestination);
      const fullGroup = {
        ...group,
        members: [...group.members, ...Array.from({ length: 3 }).map((_, index) => ({
          id: `paid-${Date.now()}-${index}`,
          studentId: `paid-${index}`,
          name: 'Student',
        }))],
        status: 'FULL' as const,
      };
      setCurrentGroup(fullGroup);
      setCurrentTrip(null);
      setPaymentSubmitted(true);
      setShowPayment(false);
      navigate('/status');
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-5 pb-24 pt-6">
      <div className="rounded-3xl bg-slate-900 p-5 text-white shadow-[0_20px_40px_rgba(15,23,42,0.24)]">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-300">New group</p>
        <h1 className="mt-2 text-2xl font-bold">{selectedPickup} → {selectedDestination}</h1>
        <div className="mt-4 rounded-2xl bg-white/5 p-3 text-sm text-slate-200">
          <div className="flex items-center justify-between">
            <span>Current passengers</span>
            <span className="font-semibold text-white">1/4</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-300">You&apos;ll be waiting for {waitingPassengers} more passengers.</p>
      </div>

      {!showPayment ? (
        <div className="space-y-3">
          <Button fullWidth onClick={handleCreateGroup} disabled={isCreating} icon={<PlusCircle size={16} />}>
            {isCreating ? 'Creating group...' : 'Create Group'}
          </Button>

          <Button fullWidth variant="secondary" onClick={handlePayForFourSeats} icon={<CreditCard size={16} />}>
            Pay for 4 Seats
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Payment</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">{selectedPickup} → {selectedDestination}</h2>
          <div className="mt-4 rounded-xl bg-slate-50 p-3">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>4 seats</span>
              <span className="font-semibold text-slate-900">₦4,000</span>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
            Card placeholder
          </div>

          <Button fullWidth className="mt-5" onClick={handlePayment}>
            Pay
          </Button>
        </div>
      )}

      {paymentSubmitted ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          Payment successful. Group status: FULL. Finding driver...
        </div>
      ) : null}
    </div>
  );
}
