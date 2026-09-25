import { calculateTotal, PricingService } from './index';

describe('10-testing-jest', () => {
  // beforeEach/afterEach run before/after every test in this describe block —
  // handy for shared setup like fake timers or fresh mock instances.
  let pricingService: jest.Mocked<PricingService>;

  beforeEach(() => {
    // jest.fn() creates a mock function whose return value we control,
    // letting us test calculateTotal() without a real PricingService.
    pricingService = { getDiscountPercent: jest.fn() };
  });

  it('applies a discount returned by the pricing service', () => {
    pricingService.getDiscountPercent.mockReturnValue(10);

    const total = calculateTotal(100, pricingService, 'cust-1');

    // toBe: strict equality — right for primitives like numbers/strings.
    expect(total).toBe(90);
    // toHaveBeenCalledWith: asserts the mock was called with these exact args.
    expect(pricingService.getDiscountPercent).toHaveBeenCalledWith('cust-1');
  });

  it('handles zero discount', () => {
    pricingService.getDiscountPercent.mockReturnValue(0);

    expect(calculateTotal(50, pricingService, 'cust-2')).toBe(50);
  });

  it('supports matchers for objects and arrays', () => {
    const order = { id: 1, items: ['a', 'b'] };

    // toEqual: deep equality — right for objects/arrays (unlike toBe).
    expect(order).toEqual({ id: 1, items: ['a', 'b'] });
    expect(order.items).toContain('a');
    expect(order).toMatchObject({ id: 1 });
  });

  it('supports async assertions', async () => {
    const asyncValue = Promise.resolve(42);
    await expect(asyncValue).resolves.toBe(42);
  });
});
