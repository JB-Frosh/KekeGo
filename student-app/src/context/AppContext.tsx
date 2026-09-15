import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { groupService } from '../services/groupService';
import { tripService } from '../services/tripService';
import { initialGroups, locations } from '../mock/data';
import type { Driver, Group, Student, Trip } from '../types';

interface AppContextValue {
  currentStudent: Student | null;
  setCurrentStudent: (student: Student | null) => void;
  groups: Group[];
  refreshGroups: () => Promise<void>;
  currentGroup: Group | null;
  setCurrentGroup: (group: Group | null) => void;
  currentTrip: Trip | null;
  setCurrentTrip: (trip: Trip | null) => void;
  selectedPickup: string;
  setSelectedPickup: (pickup: string) => void;
  selectedDestination: string;
  setSelectedDestination: (destination: string) => void;
  availableLocations: typeof locations;
  currentDriver: Driver | null;
  setCurrentDriver: (driver: Driver | null) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [groups, setGroups] = useState<Group[]>(() => initialGroups);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [selectedPickup, setSelectedPickup] = useState<string>('Faculty of Engineering');
  const [selectedDestination, setSelectedDestination] = useState<string>('Main Gate');
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(null);

  const refreshGroups = useCallback(async () => {
    const nextGroups = await groupService.getGroups();
    setGroups(nextGroups);
    setCurrentGroup((prev) => prev ? nextGroups.find((group) => group.id === prev.id) ?? prev : prev);
  }, [setCurrentGroup]);

  useEffect(() => {
    const savedStudent = localStorage.getItem('kekego-student');
    if (savedStudent) {
      setCurrentStudent(JSON.parse(savedStudent));
    }
  }, []);

  useEffect(() => {
    if (currentStudent) {
      localStorage.setItem('kekego-student', JSON.stringify(currentStudent));
    }
  }, [currentStudent]);

  useEffect(() => {
    const pendingTrip = tripService.getTrip(currentGroup?.id ?? '');
    if (pendingTrip) {
      setCurrentTrip(pendingTrip);
    }
  }, [currentGroup]);

  const value = useMemo<AppContextValue>(
    () => ({
      currentStudent,
      setCurrentStudent,
      groups,
      refreshGroups,
      currentGroup,
      setCurrentGroup,
      currentTrip,
      setCurrentTrip,
      selectedPickup,
      setSelectedPickup,
      selectedDestination,
      setSelectedDestination,
      availableLocations: locations,
      currentDriver,
      setCurrentDriver,
    }),
    [currentDriver, currentGroup, currentStudent, currentTrip, groups, refreshGroups, selectedDestination, selectedPickup],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
}
