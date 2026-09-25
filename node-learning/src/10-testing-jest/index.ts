// TOPIC: Testing with Jest
//
// This topic's real content is in index.test.ts — it's a tour of Jest features
// (matchers, mocks, lifecycle hooks, async assertions). This file just holds
// a couple of small functions for those tests to exercise.

export interface PricingService {
  getDiscountPercent(customerId: string): number;
}

export function calculateTotal(price: number, service: PricingService, customerId: string): number {
  const discount = service.getDiscountPercent(customerId);
  return Number((price * (1 - discount / 100)).toFixed(2));
}
