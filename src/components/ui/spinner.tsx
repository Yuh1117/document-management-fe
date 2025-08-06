import { cn } from "@/lib/utils";

interface SpinnerProps {
    className?: string;
    size?: number;
}

export const Spinner = ({ className, size = 24 }: SpinnerProps) => (
    <div
        className={cn(
            "animate-spin rounded-full border-4 border-muted border-t-primary",
            className
        )}
        style={{ width: size, height: size }}
    />
);
