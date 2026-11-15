# Project pages and secure portfolio admin

## What will change
- Clicking a Featured Work item opens its own shareable project page, with the full project media and description followed by related projects.
- The public Work section will read project entries from Lovable Cloud, retaining the current six projects as initial entries.
- A private admin area will allow the verified portfolio owner to sign in, create/edit/delete/reorder projects, and upload project media.
- Contact details shown publicly will be editable by the owner. Contact form submissions will be stored privately and listed in the admin area.
- Admin endpoints and database permissions will enforce owner authorization; hiding the admin page alone will not secure changes.

## Technical approach
- Extend the existing `portfolio_projects` storage additively with a URL slug, and add a separate editable contact-settings record plus private contact-submission table. Apply schema changes through the Lovable database migration workflow with explicit table grants, RLS, and database policies.
- Keep project and admin data access behind authenticated server functions, with server-side owner-role checks. Use the existing private `portfolio-work` bucket and signed media URLs for project presentation.
- Create top-level TanStack Start routes for `/work/$slug`, `/admin`, and `/admin/login`; the public project page remains shareable, and the admin UI is separate.
- Preserve the current contact info until the owner edits it; show a clear success state after submissions and avoid exposing submission details publicly.
- Verify route navigation, sign-in/admin access where credentials are available, and preview/build logs. The owner account must exist and confirm `shamirkarulai177@gmail.com` before the admin role is active.
