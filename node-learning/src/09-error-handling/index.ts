// TOPIC: Error handling
//
// Good Node error handling means: custom error types for meaningful messages,
// try/catch around both sync and async code, and a safety net for errors that
// slip through (unhandledRejection / uncaughtException) so the process doesn't
// die silently or in a confusing way.

export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = 'NotFoundError'; // shows up in stack traces / error.name checks
  }
}

export function findUser(id: number): { id: number; name: string } {
  if (id !== 1) {
    throw new NotFoundError(`User ${id}`);
  }
  return { id, name: 'Ada' };
}

export async function findUserAsync(id: number): Promise<{ id: number; name: string }> {
  // Errors thrown inside an async function automatically become a rejected Promise —
  // no need to manually wrap them.
  return findUser(id);
}

if (require.main === module) {
  try {
    findUser(999);
  } catch (err) {
    if (err instanceof NotFoundError) {
      console.error('Handled a NotFoundError:', err.message);
    } else {
      throw err; // re-throw anything we didn't expect
    }
  }

  // Safety net for anything that escapes all try/catch blocks in this process.
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled promise rejection:', reason);
  });
}
