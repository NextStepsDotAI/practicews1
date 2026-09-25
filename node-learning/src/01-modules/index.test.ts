import { add, multiply } from './mathUtils';
import square from './mathUtils';

describe('01-modules', () => {
  it('adds two numbers via a named export', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('multiplies two numbers via a named export', () => {
    expect(multiply(4, 5)).toBe(20);
  });

  it('squares a number via the default export', () => {
    expect(square(6)).toBe(36);
  });
});
