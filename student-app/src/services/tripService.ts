import { drivers, initialTrips } from '../mock/data';
import type { Group, Trip } from '../types';

let tripsState: Trip[] = [...initialTrips];

export const tripService = {
  getTrip(groupId: string): Trip | null {
    return tripsState.find((trip) => trip.groupId === groupId) ?? null;
  },

  createTripForGroup(group: Group): Trip {
    const driver = drivers[Math.floor(Math.random() * drivers.length)];
    const trip: Trip = {
      id: `T${String(tripsState.length + 1).padStart(3, '0')}`,
      groupId: group.id,
      pickup: group.pickup,
      destination: group.destination,
      driver,
      passengers: group.members.length,
      status: 'DRIVER_ASSIGNED',
      createdAt: new Date().toISOString(),
    };

    tripsState = [trip, ...tripsState];
    return trip;
  },

  updateTripStatus(groupId: string, status: Trip['status']): Trip | null {
    const trip = tripsState.find((item) => item.groupId === groupId);

    if (!trip) {
      return null;
    }

    const updatedTrip = { ...trip, status };
    tripsState = tripsState.map((item) => (item.groupId === groupId ? updatedTrip : item));
    return updatedTrip;
  },

  getTrips(): Trip[] {
    return [...tripsState];
  },
};
