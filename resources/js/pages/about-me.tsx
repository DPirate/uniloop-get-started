import { Head, Link } from '@inertiajs/react';
import { home } from '@/routes';

export default function AboutMe() {
    return (
        <>
            <Head title="About Me" />
            <div className="flex min-h-screen flex-col bg-[#FDFDFC] p-6 text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <header className="mb-6 flex w-full items-center justify-between">
                    <h1 className="text-xl font-medium">About Me</h1>
                    <Link
                        href={home()}
                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal hover:border-[#1915014a] dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                    >
                        Back to home
                    </Link>
                </header>
                <main className="flex-1">
                    <iframe
                        src="/resume.pdf"
                        title="Resume"
                        className="h-[80vh] w-full rounded-lg border border-[#e3e3e0] bg-white shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] dark:border-[#3E3E3A] dark:bg-[#161615] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]"
                    />
                </main>
            </div>
        </>
    );
}
