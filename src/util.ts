import { useRef, useEffect } from "react";
import {
    StackedChartData,
    StackedChartDataForHiChart,
} from "./stackedchart/StackedChartData";
import { AreaRangeData } from "./arearange/area-range-data";

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

export function toAreaRangeSeries(data: AreaRangeData): any[] {
    const output: any[] = [];
    const timeSeries = data.timeSeries;

    // Zero's and sub zeros are not supported on a logarithmic scale, hence adjusting 0 to 1.
    const fixZeros = (value: number) => value == 0 ? 1 : value;
    data.data.forEach((rangeData) => {
        const seriesData: any[] = [];
        const averageData: any[] = [];
        for (var i = 0; i < timeSeries.length - 1; i++) {
            seriesData.push([timeSeries[i], fixZeros(rangeData.lower.value[i]), fixZeros(rangeData.upper.value[i])]);
            averageData.push([timeSeries[i], fixZeros(rangeData.average.value[i])]);
        }
        const rangePlot = {
            name: `${rangeData.lower.id} - ${rangeData.upper.id}`,
            data: seriesData,
            type: "arearange",
            lineWidth: 0,
            linkedTo: rangeData.average.id != null ? ":previous" : "",
            fillOpacity: 0.3,
            zIndex: 0,
            marker: {
                enabled: false,
            },
        } as any;

        if ( rangeData.average.id != null){
            const average = {
                name: `${rangeData.average.id}`,
                data: averageData,
                zIndex: 1,
                marker: {
                    fillColor: "white",
                    lineWidth: 2,
                },
            } as any;
            output.push(average);
        }

        output.push(rangePlot);
    });
    return output;
}
