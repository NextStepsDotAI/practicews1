// TOPIC: Async patterns — callbacks, Promises, async/await
//
// These are three ways to express the same idea: "run this, and do something
// when it finishes." Node started with callbacks, then Promises were added to
// the language, then async/await was added as sugar on top of Promises.

// 1) Callback style (the original Node pattern: error-first callback)
export function delayCallback(ms: number, cb: (err: null, result: string) => void): void {
  setTimeout(() => cb(null, `waited ${ms}ms (callback)`), ms);
}

// 2) Promise style — wraps the same operation, avoids "callback hell"
export function delayPromise(ms: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`waited ${ms}ms (promise)`), ms);
  });
}

// 3) async/await — syntax sugar for consuming Promises as if they were synchronous
export async function delayAsyncAwait(ms: number): Promise<string> {
  const result = await delayPromise(ms);
  return `${result} -> observed via async/await`;
}

if (require.main === module) {
  delayCallback(10, (_err, result) => console.log(result));
  delayPromise(10).then((result) => console.log(result));
  delayAsyncAwait(10).then((result) => console.log(result));
}
