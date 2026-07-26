import { router } from '@inertiajs/react';
import Knight from '@/components/game/Knight';
import Pipe from '@/components/game/Pipe';
import { usePlatformer } from '@/hooks/use-platformer';
import { aboutMe } from '@/routes';
import { create as feedbackCreate } from '@/routes/feedback';
import { index as playgroundIndex } from '@/routes/playground';

const worldWidth = 960;
const worldHeight = 540;
const playerSize = { width: 48, height: 64 };
const gravity = 0.6;
const jumpStrength = -12;
const moveSpeed = 5;

const platforms = [
    { x: 0, y: worldHeight - 40, width: worldWidth, height: 40 },
    { x: 120, y: 380, width: 160, height: 20 },
    { x: 360, y: 300, width: 160, height: 20 },
];

export default function PlatformerHome() {
    const pipes = [
        {
            x: 150,
            y: 300,
            width: 56,
            height: 80,
            route: aboutMe().url,
            label: 'About Me',
        },
        {
            x: 390,
            y: 220,
            width: 56,
            height: 80,
            route: feedbackCreate().url,
            label: 'Feedback',
        },
        {
            x: 830,
            y: 420,
            width: 56,
            height: 80,
            route: playgroundIndex().url,
            label: 'Playground',
        },
    ];

    const { player, facingLeft, isGrounded } = usePlatformer({
        worldWidth,
        worldHeight,
        playerSize,
        gravity,
        jumpStrength,
        moveSpeed,
        platforms,
        pipes,
        onEnterPipe: (pipe) => router.visit(pipe.route),
    });

    return (
        <div
            className="relative overflow-hidden rounded-xl border border-[#e3e3e0] bg-sky-100 shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] dark:border-[#3E3E3A] dark:bg-slate-900 dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]"
            style={{ width: worldWidth, height: worldHeight }}
        >
            {/* Platforms */}
            {platforms.map((platform, index) => (
                <div
                    key={index}
                    className="absolute bg-amber-700 dark:bg-amber-900"
                    style={{
                        left: platform.x,
                        top: platform.y,
                        width: platform.width,
                        height: platform.height,
                    }}
                />
            ))}

            {/* Pipes */}
            {pipes.map((pipe, index) => (
                <Pipe key={index} {...pipe} />
            ))}

            {/* Knight */}
            <Knight
                x={player.x}
                y={player.y}
                width={playerSize.width}
                height={playerSize.height}
                facingLeft={facingLeft}
                isGrounded={isGrounded}
            />

            {/* Instructions */}
            <div className="absolute bottom-3 left-3 rounded-md bg-white/80 px-3 py-2 text-xs text-slate-700 backdrop-blur-sm dark:bg-black/50 dark:text-slate-200">
                Use arrow keys or A/D to move, Space to jump. Walk into a pipe
                to enter it.
            </div>
        </div>
    );
}
