export interface PipeProps {
    x: number;
    y: number;
    width: number;
    height: number;
    label?: string;
}

export default function Pipe({ x, y, width, height, label }: PipeProps) {
    const rimHeight = height * 0.22;
    const tubeHeight = height - rimHeight;

    return (
        <div
            className="absolute"
            style={{
                left: x,
                top: y,
                width,
                height,
            }}
        >
            {label && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap text-slate-700 dark:text-slate-300">
                    {label}
                </div>
            )}

            {/* Rim */}
            <div
                className="absolute top-0 left-0 z-10 rounded-sm border-b-4 border-green-800 bg-green-600 shadow-sm"
                style={{
                    width,
                    height: rimHeight,
                }}
            />

            {/* Tube */}
            <div
                className="absolute rounded-b-sm bg-green-500 shadow-sm"
                style={{
                    top: rimHeight,
                    left: width * 0.08,
                    width: width * 0.84,
                    height: tubeHeight,
                }}
            />
        </div>
    );
}
