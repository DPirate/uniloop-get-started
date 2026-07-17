export interface KnightProps {
    x: number;
    y: number;
    width: number;
    height: number;
    facingLeft: boolean;
    isGrounded: boolean;
}

export default function Knight({
    x,
    y,
    width,
    height,
    facingLeft,
    isGrounded,
}: KnightProps) {
    return (
        <div
            className="absolute"
            style={{
                left: x,
                top: y,
                width,
                height,
                transform: `scaleX(${facingLeft ? -1 : 1})`,
            }}
        >
            <div
                className="h-full w-full"
                style={{
                    animation: isGrounded
                        ? 'knight-bob 2s ease-in-out infinite'
                        : 'none',
                }}
            >
                {/* Plume */}
                <div
                    className="absolute top-0 left-1/2 z-10 -translate-x-1/2 rounded-full bg-red-600 shadow-sm"
                    style={{ width: '20%', height: '15%' }}
                />

                {/* Helmet */}
                <div
                    className="absolute top-[12%] left-1/2 z-20 -translate-x-1/2 rounded-t-lg rounded-b-md border-2 border-slate-400 bg-slate-300 shadow-sm"
                    style={{ width: '45%', height: '28%' }}
                >
                    {/* Visor */}
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-slate-800"
                        style={{ width: '70%', height: '30%' }}
                    />
                </div>

                {/* Body / armor */}
                <div
                    className="absolute top-[38%] left-1/2 z-10 -translate-x-1/2 rounded-lg border-2 border-slate-500 bg-slate-400 shadow-sm"
                    style={{ width: '40%', height: '35%' }}
                >
                    {/* Cross emblem */}
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-200"
                        style={{ width: '12%', height: '60%' }}
                    />
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-200"
                        style={{ width: '60%', height: '12%' }}
                    />
                </div>

                {/* Sword */}
                <div
                    className="absolute top-[30%] right-[-15%] z-30"
                    style={{ width: '35%', height: '50%' }}
                >
                    {/* Blade */}
                    <div className="absolute top-0 left-1/2 h-[75%] w-[25%] -translate-x-1/2 rounded-t-sm bg-slate-200 shadow-sm" />
                    {/* Guard */}
                    <div className="absolute top-[70%] left-1/2 h-[12%] w-[80%] -translate-x-1/2 rounded-sm bg-amber-700" />
                    {/* Hilt */}
                    <div className="absolute top-[78%] left-1/2 h-[22%] w-[20%] -translate-x-1/2 rounded-b-sm bg-amber-800" />
                </div>

                {/* Legs */}
                <div
                    className="absolute top-[70%] left-[22%] rounded-b-md bg-slate-500"
                    style={{ width: '18%', height: '25%' }}
                />
                <div
                    className="absolute top-[70%] right-[22%] rounded-b-md bg-slate-500"
                    style={{ width: '18%', height: '25%' }}
                />
            </div>
        </div>
    );
}
