# Subtask 2: About Me Page

## Description

Create the About Me Inertia page that displays the resume PDF in an iframe and provides a link back to the home page.

### Task Requirements
- The page must render at `/about-me`.
- It must display `resume.pdf` using a native browser `<iframe>`.
- It must include a "Back to home" link.
- It must use Tailwind v4 utilities and support dark mode.
- It must not use the application layout (same as `welcome`).

## Step-by-Step Changes

### Summary of modifications
Create a new Inertia page component. The component embeds the PDF, sets the page title, and links back to the platformer home screen.

### Code Changes

#### New Functions/Methods
**File:** `resources/js/pages/about-me.tsx`

Create the default exported React component `AboutMe`:

```tsx
export default function AboutMe() {
    return (
        <>
            <Head title="About Me" />
            {/* page JSX */}
        </>
    );
}
```

It imports:
- `Head` from `@inertiajs/react`
- `home` from `@/routes`

#### Modifications to Existing Code
None.

#### Database Changes
None.

#### Configuration Changes
None.

#### New Files
**File:** `resources/js/pages/about-me.tsx`

A full-screen or centered layout containing:
- A header with the page title and a `<Link href={home()}>` back button.
- An `<iframe src="/resume.pdf" title="Resume" className="h-[80vh] w-full" />` or similar.
- Dark-mode-aware container backgrounds.
