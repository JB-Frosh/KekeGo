import type { Payment } from '../types';

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export const paymentService = {
  async processPayment(route: string, amount: number): Promise<Payment> {
    await delay(850);

    return {
      id: `PAY-${Date.now()}`,
      route,
      amount,
      currency: 'NGN',
      status: 'SUCCESS',
      method: 'Card',
      createdAt: new Date().toISOString(),
    };
  },
};
