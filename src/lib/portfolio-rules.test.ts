import { describe, expect, it } from 'vitest';
import { isVerifiedOwner, mediaFileError, MEDIA_MAX_BYTES, MESSAGE_STATUSES } from './portfolio-rules';
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

describe('portfolio media validation', () => {
  it('accepts image and video files up to 50 MB', () => {
    expect(mediaFileError({ type: 'image/png', size: MEDIA_MAX_BYTES })).toBeNull();
    expect(mediaFileError({ type: 'video/mp4', size: 1024 })).toBeNull();
  });
  it('rejects unsupported formats and files above 50 MB', () => {
    expect(mediaFileError({ type: 'application/pdf', size: 1024 })).not.toBeNull();
    expect(mediaFileError({ type: 'image/png', size: MEDIA_MAX_BYTES + 1 })).not.toBeNull();
  });
});

describe('contact message statuses', () => {
  it('supports the requested New, Read, and Replied states', () => {
    expect(MESSAGE_STATUSES).toEqual(['new', 'read', 'replied']);
  });
});
