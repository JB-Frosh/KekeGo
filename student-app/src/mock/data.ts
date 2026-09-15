import type { Driver, Group, LocationItem, Student, Trip } from '../types';

export const locations: LocationItem[] = [
  { id: 'faculty-engineering', name: 'Faculty of Engineering' },
  { id: 'faculty-science', name: 'Faculty of Science' },
  { id: 'main-auditorium', name: 'Main Auditorium' },
  { id: 'student-union', name: 'Student Union Building' },
  { id: 'hostel-area', name: 'Hostel Area' },
  { id: 'main-gate', name: 'Main Gate' },
  { id: 'library', name: 'Library' },
  { id: 'lecture-theatre', name: 'Lecture Theatre' },
];

export const students: Student[] = [
  {
    id: 'stu-1',
    name: 'Quadri',
    department: 'Computer Engineering',
    faculty: 'Engineering',
    level: '300 Level',
    phone: '+2348012345678',
    email: 'quadri@student.edu',
    password: 'password123',
  },
  {
    id: 'stu-2',
    name: 'Aisha',
    department: 'Biology',
    faculty: 'Science',
    level: '200 Level',
    phone: '+2348023456789',
    email: 'aisha@student.edu',
    password: 'password123',
  },
  {
    id: 'stu-3',
    name: 'Daniel',
    department: 'Mechanical Engineering',
    faculty: 'Engineering',
    level: '400 Level',
    phone: '+2348034567890',
    email: 'daniel@student.edu',
    password: 'password123',
  },
  {
    id: 'stu-4',
    name: 'Samuel',
    department: 'Physics',
    faculty: 'Science',
    level: '100 Level',
    phone: '+2348045678901',
    email: 'samuel@student.edu',
    password: 'password123',
  },
];

export const drivers: Driver[] = [
  {
    id: 'drv-1',
    name: 'Musa',
    phone: '+2348051112233',
    plateNumber: 'KKE-421-A',
    rating: 4.8,
  },
  {
    id: 'drv-2',
    name: 'Tunde',
    phone: '+2348062223344',
    plateNumber: 'KKE-980-L',
    rating: 4.6,
  },
  {
    id: 'drv-3',
    name: 'Ibrahim',
    phone: '+2348073334455',
    plateNumber: 'KKE-389-H',
    rating: 4.9,
  },
];

export const initialGroups: Group[] = [
  {
    id: 'G001',
    pickup: 'Faculty of Engineering',
    destination: 'Main Gate',
    members: [
      { id: 'm-1', studentId: 'stu-1', name: 'Quadri' },
      { id: 'm-2', studentId: 'stu-3', name: 'Daniel' },
      { id: 'm-3', studentId: 'stu-2', name: 'Aisha' },
    ],
    status: 'WAITING',
    createdAt: '2026-09-14T08:10:00.000Z',
    totalSeats: 4,
  },
  {
    id: 'G002',
    pickup: 'Library',
    destination: 'Hostel Area',
    members: [
      { id: 'm-4', studentId: 'stu-4', name: 'Samuel' },
      { id: 'm-5', studentId: 'stu-2', name: 'Aisha' },
    ],
    status: 'WAITING',
    createdAt: '2026-09-14T08:20:00.000Z',
    totalSeats: 4,
  },
  {
    id: 'G003',
    pickup: 'Faculty of Science',
    destination: 'Main Gate',
    members: [
      { id: 'm-6', studentId: 'stu-2', name: 'Aisha' },
      { id: 'm-7', studentId: 'stu-4', name: 'Samuel' },
      { id: 'm-8', studentId: 'stu-3', name: 'Daniel' },
      { id: 'm-9', studentId: 'stu-1', name: 'Quadri' },
    ],
    status: 'SEARCHING_DRIVER',
    createdAt: '2026-09-14T07:58:00.000Z',
    totalSeats: 4,
  },
];

export const initialTrips: Trip[] = [
  {
    id: 'T001',
    groupId: 'G003',
    pickup: 'Faculty of Science',
    destination: 'Main Gate',
    driver: drivers[0],
    passengers: 4,
    status: 'DRIVER_ASSIGNED',
    createdAt: '2026-09-14T08:00:00.000Z',
  },
];
