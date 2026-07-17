import { useEffect, useRef, useState } from 'react';

export interface Platform {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Pipe {
    x: number;
    y: number;
    width: number;
    height: number;
    route: string;
    label: string;
}

export interface UsePlatformerOptions {
    worldWidth: number;
    worldHeight: number;
    playerSize: { width: number; height: number };
    gravity: number;
    jumpStrength: number;
    moveSpeed: number;
    platforms: Platform[];
    pipes: Pipe[];
    onEnterPipe: (pipe: Pipe) => void;
}

export interface UsePlatformerState {
    player: { x: number; y: number; vx: number; vy: number };
    facingLeft: boolean;
    isGrounded: boolean;
    activePipe: Pipe | null;
}

export function usePlatformer(
    options: UsePlatformerOptions,
): UsePlatformerState {
    const optionsRef = useRef(options);

    useEffect(() => {
        optionsRef.current = options;
    });

    const keys = useRef<Set<string>>(new Set());
    const playerRef = useRef({
        x: 50,
        y: options.worldHeight - options.playerSize.height,
        vx: 0,
        vy: 0,
    });

    const [player, setPlayer] = useState({
        x: 50,
        y: options.worldHeight - options.playerSize.height,
        vx: 0,
        vy: 0,
    });
    const [facingLeft, setFacingLeft] = useState(false);
    const [isGrounded, setIsGrounded] = useState(false);
    const [activePipe, setActivePipe] = useState<Pipe | null>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            keys.current.add(event.code);

            if (event.code === 'Space') {
                event.preventDefault();
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            keys.current.delete(event.code);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        let animationId: number;
        let wasGrounded = false;
        let lastPipeRoute: string | null = null;

        const loop = () => {
            const {
                worldWidth,
                worldHeight,
                playerSize,
                gravity,
                jumpStrength,
                moveSpeed,
                platforms,
                pipes,
                onEnterPipe,
            } = optionsRef.current;

            const movingLeft =
                keys.current.has('ArrowLeft') || keys.current.has('KeyA');
            const movingRight =
                keys.current.has('ArrowRight') || keys.current.has('KeyD');

            let vx = 0;

            if (movingLeft) {
                vx = -moveSpeed;
            }

            if (movingRight) {
                vx = moveSpeed;
            }

            if (movingLeft && !movingRight) {
                setFacingLeft((previous) => (previous ? previous : true));
            } else if (movingRight && !movingLeft) {
                setFacingLeft((previous) => (previous ? false : previous));
            }

            let { x, y, vy } = playerRef.current;
            vy += gravity;
            vy = Math.min(vy, 12);

            const jumpPressed =
                keys.current.has('Space') ||
                keys.current.has('ArrowUp') ||
                keys.current.has('KeyW');

            if (jumpPressed && wasGrounded) {
                vy = jumpStrength;
                wasGrounded = false;
            }

            x += vx;
            x = Math.max(0, Math.min(worldWidth - playerSize.width, x));

            y += vy;

            let grounded = false;
            const playerBottom = y + playerSize.height;

            for (const platform of platforms) {
                const overlapsHorizontally =
                    x < platform.x + platform.width &&
                    x + playerSize.width > platform.x;
                const wasAbove = playerBottom - vy <= platform.y;
                const isAtOrBelow = playerBottom >= platform.y;

                if (
                    overlapsHorizontally &&
                    wasAbove &&
                    isAtOrBelow &&
                    vy >= 0
                ) {
                    y = platform.y - playerSize.height;
                    vy = 0;
                    grounded = true;
                    break;
                }
            }

            if (playerBottom >= worldHeight) {
                y = worldHeight - playerSize.height;
                vy = 0;
                grounded = true;
            }

            playerRef.current = { x, y, vx, vy };
            setPlayer({ ...playerRef.current });
            setIsGrounded(grounded);
            wasGrounded = grounded;

            const playerRect = {
                x,
                y,
                width: playerSize.width,
                height: playerSize.height,
            };

            const currentPipe =
                pipes.find((pipe) => checkPipeTopCollision(playerRect, vy, pipe)) || null;
            setActivePipe(currentPipe);

            if (currentPipe && currentPipe.route !== lastPipeRoute) {
                lastPipeRoute = currentPipe.route;
                onEnterPipe(currentPipe);
            } else if (!currentPipe) {
                lastPipeRoute = null;
            }

            animationId = requestAnimationFrame(loop);
        };

        animationId = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(animationId);
    }, []);

    return { player, facingLeft, isGrounded, activePipe };
}

function checkPipeTopCollision(
    playerRect: { x: number; y: number; width: number; height: number },
    vy: number,
    pipe: Pipe,
): boolean {
    const boxWidth = pipe.width * 0.6;
    const boxHeight = 12;
    const box = {
        x: pipe.x + (pipe.width - boxWidth) / 2,
        y: pipe.y - boxHeight + 4,
        width: boxWidth,
        height: boxHeight,
    };

    const isMovingDown = vy >= 0;

    return (
        isMovingDown &&
        playerRect.x < box.x + box.width &&
        playerRect.x + playerRect.width > box.x &&
        playerRect.y < box.y + box.height &&
        playerRect.y + playerRect.height > box.y
    );
}
