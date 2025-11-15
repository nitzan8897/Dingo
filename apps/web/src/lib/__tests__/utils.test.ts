import { cn } from '../utils';

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('should handle conditional classes', () => {
    expect(cn('base', true && 'truthy', false && 'falsy')).toBe('base truthy');
  });

  it('should handle undefined and null', () => {
    expect(cn('base', undefined, null, 'another')).toBe('base another');
  });
});
