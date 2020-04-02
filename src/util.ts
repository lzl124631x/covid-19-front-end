import { useRef, useEffect } from "react";

export function useInterval(callback: () => void, delay: number | null) {
    const cb = useRef<() => void>();
    useEffect(() => {
        cb.current = callback;
    });
    useEffect(() => {
        if (delay === null) return;
        const id = setInterval(() => cb.current && cb.current(), delay);
        return () => clearInterval(id);
    }, [delay]);
}
