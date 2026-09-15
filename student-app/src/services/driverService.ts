import { drivers } from '../mock/data';
import type { Driver } from '../types';

export const driverService = {
  async getDriver(driverId: string): Promise<Driver> {
    const driver = drivers.find((item) => item.id === driverId);

    if (!driver) {
      throw new Error('Driver not found.');
    }

    return driver;
  },

  async getAvailableDrivers(): Promise<Driver[]> {
    return [...drivers];
  },
};
