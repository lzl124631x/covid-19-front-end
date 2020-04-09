import { ContactData } from "./type";

const colors = ["#ff0000", "#660099", "#0073BD", "#404040"];

const range = (
    timeSeries: number[],
    lower?: number[],
    upper?: number[]
): any[] => {
    const output: any[] = [];
    if (lower != null && upper != null) {
        for (let i = 0; i < timeSeries.length; i++) {
            output.push([timeSeries[i], lower[i], upper[i]]);
        }
    }
    return output;
};

const linedata = (timeSeries: number[], lower?: number[]): any[] => {
    const output: any[] = [];
    if (lower != null) {
        for (let i = 0; i < timeSeries.length; i++) {
            output.push([timeSeries[i], lower[i]]);
        }
    }
    return output;
};

export function toProjectionData(
    data: ContactData,
    timeSeries: number[],
    index: number,
    showLog: boolean
): any[] {
    const plotOptions = {
        marker: {
            enabled: false,
            radius: 1,
            symbol: "circle",
        },
    };

    data.percentileData.forEach(
        (d) => (d.data = d.data.map((x) => (x <= 0 ? 1 : x)))
    );

    const percentiledata2 = data.percentileData.find(
        (_) => _.percentile === "2.5"
    )?.data;
    const percentiledata25 = data.percentileData.find(
        (_) => _.percentile === "25"
    )?.data;
    const percentiledata50 = data.percentileData.find(
        (_) => _.percentile === "50"
    )?.data;
    const percentiledata75 = data.percentileData.find(
        (_) => _.percentile === "75"
    )?.data;
    const percentiledata97 = data.percentileData.find(
        (_) => _.percentile === "97.5"
    )?.data;

    const output: any[] = [];
    output.push({
        name: `2.5% to 97.5%`,
        data: range(timeSeries, percentiledata2, percentiledata97),
        type: "arearange",
        lineWidth: 0,
        color: colors[index],
        fillOpacity: 0.3,
        zIndex: 0,
        ...plotOptions,
    } as any);

    output.push({
        name: `25% to 75%`,
        data: range(timeSeries, percentiledata25, percentiledata75),
        type: "arearange",
        lineWidth: 0,
        color: colors[index],
        fillOpacity: 0.3,
        zIndex: 0,
        ...plotOptions,
    } as any);

    output.push({
        name: `50%`,
        data: linedata(timeSeries, percentiledata50),
        zIndex: 1,
        color: colors[index],
        opacity: 0.5,
        ...plotOptions,
    } as any);

    return output;
}
