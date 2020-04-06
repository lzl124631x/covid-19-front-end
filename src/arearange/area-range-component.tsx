import * as React from "react";
import * as Highcharts from "highcharts";
import more from "highcharts/highcharts-more";
import HighchartsReact from "highcharts-react-official";
import { getRangeData } from "../service";
import { AreaRangeData } from "./area-range-data";
import { toAreaRangeSeries } from "./util";
import { typeOptions, stateCodeOptions } from "../constants";
more(Highcharts);

interface AreaRangeProps {
    type: string;
    stateCode: string;
}

interface AreaRangeState {
    optionsForAllCharts: Highcharts.Options[];
}

const optionsDelegate = (rangeData: AreaRangeData): Highcharts.Options => {
    const title =
        rangeData.contact === "100"
            ? "No intervention"
            : rangeData.contact + "% contact";
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
                text: rangeData.chartingMetadata.xAxisLabel,
            },
        },

        yAxis: {
            minorTickInterval: 0.1,
            title: {
                text: rangeData.chartingMetadata.yAxisLabel,
            },
        },

        tooltip: {
            crosshairs: true,
            shared: true,
        } as any,

        legend: {
            enabled: false,
        },

        series: toAreaRangeSeries(rangeData),
    };
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
            this.props.stateCode !== oldProps.stateCode ||
            this.props.type !== oldProps.type
        ) {
            this.loadData();
        }
    }

    public render() {
        return this.renderCharts(this.state.optionsForAllCharts);
    }

    private renderCharts(optionsList: Highcharts.Options[]): JSX.Element {
        const typeText = typeOptions.find((_) => _.key === this.props.type)
            ?.text;
        const stateText = stateCodeOptions.find(
            (s) => s.key === this.props.stateCode
        )?.text;
        return (
            <div className="projections">
                <div className="projection-title">
                    Projection of {typeText} for {stateText}
                </div>
                <div className="projection-charts">
                    {optionsList.map((options) => (
                        <HighchartsReact
                            key={options.title?.text}
                            highcharts={Highcharts}
                            options={options}
                        />
                    ))}
                </div>
            </div>
        );
    }

    private async loadData() {
        const data = await getRangeData({
            type: this.props.type,
            stateCode: this.props.stateCode,
        });
        if (data) {
            data.forEach((rangeData) =>
                this.populateChartingMetadata(
                    rangeData,
                    this.props.type,
                    this.props.stateCode
                )
            );
            const optionsForAllCharts = data.map(optionsDelegate);
            this.setState({ optionsForAllCharts });
        }
    }

    private populateChartingMetadata(
        rangeData: AreaRangeData,
        type: string,
        stateCode: string
    ): void {
        const typeText = typeOptions.find((_) => _.key === type)?.text;
        rangeData.chartingMetadata = {
            xAxisLabel: `Dates`,
            yAxisLabel: `Number of ${type}s`,
        };
    }
}
