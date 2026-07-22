# Subtask 7: Welcome Page Replacement

## Description

Replace the existing static welcome page with the platformer home screen while preserving the top-right authentication links.

### Task Requirements
- The `/` route must render the platformer instead of the static welcome content.
- The Log in / Register buttons must remain visible for guests.
- The Dashboard button must remain visible for authenticated users.
- The page must still use no layout.

## Step-by-Step Changes

### Summary of modifications
Rewrite `resources/js/pages/welcome.tsx` to a minimal shell that renders the auth navigation and the `PlatformerHome` component. Remove all existing static welcome JSX.

### Code Changes

#### New Functions/Methods
None.

#### Modifications to Existing Code
**File:** `resources/js/pages/welcome.tsx`

Replace the entire file content with:

```tsx
import { Head, Link, usePage } from '@inertiajs/react';
import PlatformerHome from '@/components/game/PlatformerHome';
import { dashboard, login, register } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Welcome" />
            <div className="relative flex min-h-screen flex-col items-center bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <header className="absolute top-0 right-0 z-10 p-6">
                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link href={dashboard()}>Dashboard</Link>
                        ) : (
                            <>
                                <Link href={login()}>Log in</Link>
                                <Link href={register()}>Register</Link>
                            </>
                        )}
                    </nav>
                </header>
                <main className="flex grow items-center justify-center p-6">
                    <PlatformerHome />
                </main>
            </div>
        </>
    );
}
```

#### Database Changes
None.

#### Configuration Changes
None.

#### New Files
None.
