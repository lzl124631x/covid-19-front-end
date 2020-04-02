export interface IStackedChart{
    title: string,
    categories: Array<string>,
    xAxisLabel: string,
    yAxisLabel: string,
    series: Array<IStackedChartSeries>
}

export interface IStackedChartSeries {
    name: string;
    data: Array<number>;
}