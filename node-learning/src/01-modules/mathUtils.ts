// A small helper module — the thing being imported by index.ts.
// Using `export` here (ES module syntax) is compiled to CommonJS's
// `module.exports` under the hood because tsconfig.json sets module: "CommonJS".

export function add(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

// A default export — only one of these is allowed per module.
export default function square(n: number): number {
  return n * n;
}
