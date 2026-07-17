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
