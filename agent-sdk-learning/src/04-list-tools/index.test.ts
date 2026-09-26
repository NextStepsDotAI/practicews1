import { formatToolList } from './toolListFormatting';

describe('04-list-tools: formatToolList', () => {
  it('formats an empty tool list', () => {
    expect(formatToolList([])).toBe('Found 0 built-in tools in this session:\n');
  });

  it('formats a list of tool names, one per line', () => {
    const result = formatToolList(['Read', 'Bash']);
    expect(result).toBe('Found 2 built-in tools in this session:\n\n- Read\n- Bash');
  });
});
