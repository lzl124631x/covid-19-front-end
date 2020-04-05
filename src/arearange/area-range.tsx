import * as React from "react";
import * as Highcharts from "highcharts";
import more from "highcharts/highcharts-more";
import HighchartsReact from "highcharts-react-official";
import { getRangeData } from "../service";
import { RangeData } from "./range-data";
import { toAreaRangeSeries } from "../util";
more(Highcharts);

interface AreaRangeProps {
    type: string;
    contact: string;
    stateCode: string;
}

interface AreaRangeState {
    options: Highcharts.Options;
}

const optionsDelegate = (rangeData: RangeData): Highcharts.Options => {
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

export class AreaRange extends React.Component<AreaRangeProps, AreaRangeState> {
    public constructor(props: AreaRangeProps) {
        super(props);
        this.state = {
            options: {},
        };
    }
    public async componentDidMount() {
        await this.loadData();
    }

    public async componentDidUpdate(oldProps: AreaRangeProps) {
        if (
            this.props.contact != oldProps.contact ||
            this.props.stateCode != oldProps.stateCode ||
            this.props.type != oldProps.type
        ) {
            this.loadData();
        }
    }
    public render() {
        return (
            <HighchartsReact
                highcharts={Highcharts}
                options={this.state.options}
            />
        );
    }

    private async loadData() {
        const data = await getRangeData({
            contact: this.props.contact,
            type: this.props.type,
            stateCode: this.props.stateCode,
        });
        if (data != null) {
            const options = optionsDelegate(data[0]);
            this.setState({ options });
        }
    }
}
