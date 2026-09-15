export type Role = 'student' | 'driver';

export type GroupStatus =
  | 'WAITING'
  | 'FULL'
  | 'SEARCHING_DRIVER'
  | 'DRIVER_ASSIGNED'
  | 'DRIVER_ACCEPTED'
  | 'IN_TRIP'
  | 'COMPLETED'
  | 'CANCELLED';

export type TripStatus =
  | 'DRIVER_ASSIGNED'
  | 'DRIVER_ACCEPTED'
  | 'IN_TRIP'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface Student {
  id: string;
  name: string;
  department: string;
  faculty: string;
  level: string;
  phone: string;
  email: string;
  password?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  plateNumber: string;
  rating: number;
}

export interface GroupMember {
  id: string;
  studentId: string;
  name: string;
}

export interface LocationItem {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  pickup: string;
  destination: string;
  members: GroupMember[];
  status: GroupStatus;
  createdAt: string;
  totalSeats: number;
  seatsPaid?: boolean;
}

export interface Trip {
  id: string;
  groupId: string;
  pickup: string;
  destination: string;
  driver: Driver;
  passengers: number;
  status: TripStatus;
  createdAt: string;
}

export interface Payment {
  id: string;
  route: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: string;
  createdAt: string;
}

export interface LoginPayload {
  emailOrPhone: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  department: string;
  faculty: string;
  level: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}
