import * as React from "react";
import * as Highcharts from "highcharts";
import more from "highcharts/highcharts-more";
import HighchartsReact from "highcharts-react-official";
import { getRangeData } from "../service";
import { AreaRangeData } from "./area-range-data";
import { toAreaRangeSeries } from "../util";
more(Highcharts);

interface AreaRangeProps {
    type: string;
    stateCode: string;
}

interface AreaRangeState {
    optionsForAllCharts: Highcharts.Options[];
}

const optionsDelegate = (rangeData: AreaRangeData): Highcharts.Options => {
    return {
        title: {
            text: rangeData.chartingMetadata.title,
        },
        xAxis: {
            type: "datetime",
            dateTimeLabelFormats: {
                day: "%e %b",
                month: "%b%y",
            },
            title: {
                text: rangeData.chartingMetadata.xAxisLabel,
            },
        },

        yAxis: {
            type: "logarithmic",
            minorTickInterval: 0.1,
            labels: {
                formatter: function () {
                    return Math.log10(this.value).toPrecision(3);
                },
            } as any,
            title: {
                text: rangeData.chartingMetadata.yAxisLabel,
            },
        },
        
        tooltip: {
            crosshairs: true,
            shared: true,
        } as any,

        series: toAreaRangeSeries(rangeData),
    };
};

export class AreaRangeComponent extends React.Component<AreaRangeProps, AreaRangeState> {
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
        return optionsList.map(options => 
        <HighchartsReact
            key={options.title?.text}
            highcharts={Highcharts}
            options={options}
        />)
    }

    private async loadData() {
        const data = await getRangeData({
            type: this.props.type,
            stateCode: this.props.stateCode,
        });
        if (data != null) {
            const optionsForAllCharts = data.map(optionsDelegate);
            this.setState({ optionsForAllCharts });
        }
    }
}
