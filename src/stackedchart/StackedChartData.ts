export interface StackedChartData{
    title: string,
    xAxisData: Array<string>,
    xAxisLabel: string,
    yAxisLabel: string,
    charts: Array<ChartData>
}

export interface ChartData {
    name: string;
    data: Array<number>;
}


export interface StackedChartDataForHiChart {
    title: string,
    categories: Array<string>,
    xAxisLabel: string,
    yAxisLabel: string,
    charts: Array<ChartData>
}