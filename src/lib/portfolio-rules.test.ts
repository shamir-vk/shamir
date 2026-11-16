import { describe, expect, it } from 'vitest';
import { isVerifiedOwner } from './portfolio-rules';
describe('portfolio owner access', () => {
  it('permits the confirmed portfolio owner with an admin role', () => {
    expect(isVerifiedOwner({ email: 'shamirkarulai177@gmail.com', email_confirmed_at: '2026-11-16' }, true)).toBe(true);
  });
  it('denies an unconfirmed owner', () => {
    expect(isVerifiedOwner({ email: 'shamirkarulai177@gmail.com' }, true)).toBe(false);
  });
  it('denies other accounts even with an admin role', () => {
    expect(isVerifiedOwner({ email: 'someone@example.com', email_confirmed_at: '2026-11-16' }, true)).toBe(false);
  });
  it('denies the owner without an admin role', () => {
    expect(isVerifiedOwner({ email: 'shamirkarulai177@gmail.com', email_confirmed_at: '2026-11-16' }, false)).toBe(false);
  });
});
