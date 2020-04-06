export interface AreaRangeData {
    type: string;
    contact: string;
    data: RangeDefinition[];
    timeSeries: number[];
    chartingMetadata: ChartingMetadata;
}

export interface ChartingMetadata {
    yAxisLabel: string;
}

export interface RangeDefinition {
    upper: Bound;
    lower: Bound;
    average: Bound;
}

export interface Bound {
    id: string;
    value: number[];
}
