// Pure formatting logic, kept separate from index.ts so it's testable
// without a live API call.
export function formatToolList(tools: string[]): string {
  return [`Found ${tools.length} built-in tools in this session:`, '', ...tools.map((name) => `- ${name}`)].join(
    '\n',
  );
}
