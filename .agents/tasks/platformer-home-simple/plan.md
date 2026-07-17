# Ticket: Simple 2D Platformer Home Screen + About Me Page

## Summary

Replace the current `/` welcome page with a simple, keyboard-controlled 2D platformer home screen. The user controls a CSS-block knight, walks into Mario-style pipes to navigate to other pages, and keeps the existing Log in / Register buttons. Add a new `/about-me` page that displays the user's resume PDF. Add a new `/feedback` page with a simple feedback form, exposed as a fourth pipe on the home screen.

### Changes Required
- Add a new Inertia route `GET /about-me` named `about-me`.
- Add a placeholder `public/resume.pdf` file.
- Create a new `resources/js/pages/about-me.tsx` page that embeds the PDF.
- Replace the existing `resources/js/pages/welcome.tsx` static welcome page with a game shell.
- Create three reusable CSS-block game components under `resources/js/components/game/`:
  - `Knight.tsx` — the player character
  - `Pipe.tsx` — Mario-style navigation pipes
  - `PlatformerHome.tsx` — the game stage and layout
- Create a custom physics hook `resources/js/hooks/use-platformer.ts` handling gravity, jumping, collision, and pipe entry.
- Wire the four pipes to existing Wayfinder routes: `aboutMe`, `dashboard`, `settingsProfile`, and the new feedback form.
- Keep the existing login/register/dashboard buttons at the top-right of the page.
- Add a `GET /feedback` route and a `POST /feedback` route.
- Create a new `FeedbackController` with `create()` and `store()` methods.
- Create a new `resources/js/pages/feedback.tsx` form page.
- No backend migrations, models, or external game libraries.

### Environment Setup
- No new environment variables or dependencies.
- Wayfinder is already configured in `vite.config.ts` and will auto-generate route helpers after the new route is added.
- Node.js and PHP dependencies are already installed in the project.

### High-Level Use Case
A visitor lands on the site and sees a small platformer level. They use the keyboard to move the knight left/right and jump onto platforms. Walking into a pipe triggers an Inertia visit to the corresponding page:
- About Me pipe → `/about-me` (resume PDF)
- Dashboard pipe → `/dashboard` (requires authentication; guests are redirected to login)
- Settings pipe → `/settings/profile`
- Feedback pipe → `/feedback` (simple contact/feedback form)
Authenticated users see the Dashboard pipe active; guests see it locked/redirected.

### Implementation Analysis

**Problem Statement:**
The current welcome page is a static Laravel marketing layout. The product owner wants a more playful, interactive entry point that doubles as navigation and introduces an About Me page for the resume.

**Objectives:**
1. Make the home page memorable and interactive without adding heavy dependencies.
2. Provide clear navigation to the most important pages.
3. Add a new About Me page with resume display.
4. Add a new Feedback form page accessible from the platformer.
5. Keep the existing auth buttons intact.

**Constraints:**
- Must use CSS blocks for the knight and pipes (no image sprites).
- Keyboard-only controls (no on-screen touch controls).
- Must work with Inertia.js + React v3 + Tailwind v4.
- Must not break existing auth routes or layout logic.

**Approach Options:**
1. **Custom React physics hook** — implement gravity, jump, and AABB collision manually. Lightweight, no dependencies, fully idiomatic.
2. **Canvas-based rendering** — use HTML5 canvas for the game world. Smoother for many objects but harder to integrate with React/Inertia and overkill for a single screen.
3. **Lightweight game library (e.g., Phaser)** — robust physics but adds a large dependency and a separate rendering layer.

**Final Decision:**
Use Option 1 (custom React physics + DOM rendering) because it keeps the stack consistent, avoids dependencies, and is sufficient for a simple one-screen platformer.

**Potential Risks and Mitigation:**
- **Physics feel:** Jump/gravity tuning may feel off. Mitigate by exposing constants and testing with a few manual iterations.
- **Performance:** `requestAnimationFrame` with React state can cause re-renders every frame. Mitigate by keeping state minimal and only re-rendering the absolutely necessary parts.
- **Route helpers missing:** After adding the new route, the generated `@/routes` helper may not exist. Mitigate by running `php artisan wayfinder:generate` if needed.
- **Resume PDF missing:** The page will show a broken embed if `public/resume.pdf` is not present. Mitigate by adding a placeholder file and documenting that the user must replace it.
- **Feedback storage:** The feedback form does not persist data in this scope. Mitigate by flashing a success message and documenting that backend persistence can be added later.

### Review with Lead
- Confirm the list of pages linked by the four pipes (About Me, Dashboard, Settings/Profile, Feedback).
- Confirm the resume PDF placement strategy (`public/resume.pdf`).
- Confirm whether the Dashboard pipe should be hidden or visible-but-locked for guests.
- Confirm visual style (green Mario pipes, CSS-block knight) and control scheme (arrow keys + WASD + space).
- Confirm the feedback form fields (name, email, message) and whether submissions should be stored or just validated and acknowledged.

### Missing Information
- The actual resume PDF file is user content and not part of the code change; we will provide a placeholder.
- No decision yet on whether the Dashboard pipe should be hidden or visible-but-locked for guests. This plan proposes visible-but-locked/redirected.
- No decision on exact color palette beyond "green pipes"; we will use the existing Tailwind color palette.
- The feedback form currently acknowledges submission with a flash message and does not persist data; confirm if persistence is required.
