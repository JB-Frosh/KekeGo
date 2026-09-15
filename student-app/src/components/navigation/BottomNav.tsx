import { CarFront, House, UserRound, Users } from 'lucide-react';
import type { ReactNode } from 'react';

type TabKey = 'home' | 'groups' | 'trips' | 'profile';

interface BottomNavProps {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}

const items: Array<{ key: TabKey; label: string; icon: ReactNode }> = [
  { key: 'home', label: 'Home', icon: <House size={18} /> },
  { key: 'groups', label: 'Groups', icon: <Users size={18} /> },
  { key: 'trips', label: 'Trips', icon: <CarFront size={18} /> },
  { key: 'profile', label: 'Profile', icon: <UserRound size={18} /> },
];

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-md items-center justify-between border-t border-slate-200 bg-white/95 px-4 py-2 backdrop-blur-sm">
      {items.map((item) => {
        const isActive = item.key === activeTab;

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={`flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition ${
              isActive ? 'text-sky-700' : 'text-slate-500'
            }`}
          >
            <span className={`rounded-lg p-1 ${isActive ? 'bg-sky-100 text-sky-700' : ''}`}>{item.icon}</span>
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
