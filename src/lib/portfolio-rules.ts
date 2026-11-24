export const OWNER_EMAIL = 'shamirkarulai177@gmail.com';
export const MESSAGE_STATUSES = ['new', 'read', 'replied'] as const;
export const MEDIA_MAX_BYTES = 50 * 1024 * 1024;
export const MEDIA_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'] as const;

export function isVerifiedOwner(user: { email?: string; email_confirmed_at?: string } | null, admin: boolean) {
  return Boolean(user?.email_confirmed_at && user.email?.toLowerCase() === OWNER_EMAIL && admin);
}

export function projectSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function mediaFileError(file: { type: string; size: number }) {
  if (!MEDIA_MIME_TYPES.includes(file.type as (typeof MEDIA_MIME_TYPES)[number])) {
    return 'Choose a JPG, PNG, WebP, GIF, MP4 or WebM file.';
  }
  if (file.size > MEDIA_MAX_BYTES) return 'Choose a file smaller than 50 MB.';
  return null;
}
