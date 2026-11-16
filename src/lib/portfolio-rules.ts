export const OWNER_EMAIL = 'shamirkarulai177@gmail.com';
export function isVerifiedOwner(user: { email?: string; email_confirmed_at?: string } | null, admin: boolean) {
  return Boolean(user?.email_confirmed_at && user.email?.toLowerCase() === OWNER_EMAIL && admin);
}
export function projectSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
