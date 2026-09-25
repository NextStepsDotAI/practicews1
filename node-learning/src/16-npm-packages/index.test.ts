import { generateId } from './index';

describe('16-npm-packages', () => {
  it('generates an ID of the default length (21 chars for nanoid)', () => {
    expect(generateId()).toHaveLength(21);
  });

  it('generates an ID of a custom length', () => {
    expect(generateId(8)).toHaveLength(8);
  });

  it('generates unique IDs across calls', () => {
    expect(generateId()).not.toBe(generateId());
  });
});
