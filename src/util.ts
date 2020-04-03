import { useRef, useEffect } from "react";
import {
    StackedChartData,
    StackedChartDataForHiChart,
} from "./stackedchart/StackedChartData";

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

export function toHighChartData(
    data: StackedChartData
): StackedChartDataForHiChart {
    const output: StackedChartDataForHiChart = {
        ...data,
        categories: data.xAxisData,
    };
    return output;
}
