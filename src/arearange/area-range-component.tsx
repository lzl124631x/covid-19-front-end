import * as React from "react";
import * as Highcharts from "highcharts";
import more from "highcharts/highcharts-more";
import HighchartsReact from "highcharts-react-official";
import { getTimeSeriesData } from "../service";
import { TimeSeriesData, ContactData } from "./time-series-data";
import { typeOptions } from "../constants";
more(Highcharts);

interface AreaRangeProps {
    type: string;
    stateCode: string;
}

interface AreaRangeState {
    optionsForAllCharts: Highcharts.Options[];
}

const transform = (timeSeries: number[], lower?: number[], upper?: number[]) : any[] => {
    const output: any[] = [];
    if (lower != null && upper != null){
        for (let i=0; i< timeSeries.length; i++){
            output.push([timeSeries[i], lower[i], upper[i]]);
        }
    }
    return output;
}

const toAreaRangeSeries = (contactData: ContactData, timeSeries: number[]): any[] => {
    const percentileData = contactData.percentileData;
    const percentile_2 = percentileData.find(_ => _.percentile==="2.5")?.data;
    const percentile_25 = percentileData.find(_ => _.percentile==="25")?.data;
    const percentile_50 = percentileData.find(_ => _.percentile==="50")?.data;
    const percentile_75 = percentileData.find(_ => _.percentile==="75")?.data;
    const percentile_97 = percentileData.find(_ => _.percentile==="97.5")?.data;

    const output: any[] = [];
    output.push({
        name: `2.5% - 97.5%`,
        data: transform(timeSeries, percentile_2, percentile_97),
        type: "arearange",
        lineWidth: 0,
        fillOpacity: 0.3,
        zIndex: 0,
        marker: {
            enabled: false,
        },
    } as any);

    output.push({
        name: `25% - 75%`,
        data: transform(timeSeries, percentile_25, percentile_75),
        type: "arearange",
        lineWidth: 0,
        fillOpacity: 0.3,
        zIndex: 0,
        marker: {
            enabled: false,
        },
    } as any);

    output.push({
        name: `50%`,
        data: percentile_50 != null ? percentile_50 : [],
        zIndex: 1,
        marker: {
            enabled: false,
        },
    } as any);

    console.log(JSON.stringify(output));
    return output;
};

const optionsDelegate = (data: TimeSeriesData): Highcharts.Options[] => {
    const type = data.type;
    const stateCode = data.stateCode;
    const typeText = typeOptions.find((_) => _.key === type)?.text;
    const xAxisLabel = `Dates`;
    const yAxisLabel = `Number of ${type}s`;
    return data.contactData.map((_eachContactData) => {
        const title = `${typeText}s for ${
            100 - parseInt(_eachContactData.contact.replace("data",""))
        }% intervention for state ${stateCode}`;
        return {
            title: {
                text: title,
            },
            xAxis: {
                type: "datetime",
                dateTimeLabelFormats: {
                    day: "%e %b",
                    month: "%b%y",
                },
                title: {
                    text: xAxisLabel,
                },
            },

            yAxis: {
                minorTickInterval: 0.1,
                title: {
                    text: yAxisLabel,
                },
            },

            tooltip: {
                crosshairs: true,
                shared: true,
            } as any,

            series: toAreaRangeSeries(_eachContactData, data.timeSeries),
        };
    });
};

export class AreaRangeComponent extends React.Component<
    AreaRangeProps,
    AreaRangeState
> {
    public constructor(props: AreaRangeProps) {
        super(props);
        this.state = {
            optionsForAllCharts: [],
        };
    }
    public async componentDidMount() {
        await this.loadData();
    }

    public async componentDidUpdate(oldProps: AreaRangeProps) {
        if (
            this.props.stateCode != oldProps.stateCode ||
            this.props.type != oldProps.type
        ) {
            this.loadData();
        }
    }
    public render() {
        return this.renderCharts(this.state.optionsForAllCharts);
    }

    private renderCharts(optionsList: Highcharts.Options[]): JSX.Element[] {
        return optionsList.map((options) => (
            <HighchartsReact
                key={options.title?.text}
                highcharts={Highcharts}
                options={options}
            />
        ));
    }

    private async loadData() {
        const data = await getTimeSeriesData({
            type: this.props.type,
            stateCode: this.props.stateCode,
        });
        if (data != null) {
            const optionsForAllCharts = optionsDelegate(data);
            this.setState({ optionsForAllCharts });
        }
    }
}
