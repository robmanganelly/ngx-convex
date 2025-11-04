import { describe, it, expect } from 'vitest';
import { ERRORS } from './errors';
describe('ERRORS', () => {
  it('should match snapshot', () => {
    expect(ERRORS).toMatchSnapshot();
  });
});
