import { NotFoundError, findUser, findUserAsync } from './index';

describe('09-error-handling', () => {
  it('returns the user when found', () => {
    expect(findUser(1)).toEqual({ id: 1, name: 'Ada' });
  });

  it('throws a NotFoundError (sync) when the user does not exist', () => {
    expect(() => findUser(999)).toThrow(NotFoundError);
    expect(() => findUser(999)).toThrow('User 999 not found');
  });

  it('rejects with a NotFoundError (async) when the user does not exist', async () => {
    await expect(findUserAsync(999)).rejects.toBeInstanceOf(NotFoundError);
  });
});
