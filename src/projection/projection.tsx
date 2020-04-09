import * as React from "react";
import * as Highcharts from "highcharts";
import more from "highcharts/highcharts-more";
import HighchartsReact from "highcharts-react-official";
import { getTimeSeriesData } from "../service";
import { ContactData, TimeSeriesData } from "./type";
import { toProjectionData } from "./util";
import { typeOptions, stateCodeOptions } from "../constants";
import "./projection.sass";
import { getContactText } from "../util";
import { Toggle } from "@fluentui/react";
more(Highcharts);

interface AreaRangeProps {
    type: string;
    stateCode: string;
    contactsCnt: number;
}

interface AreaRangeState {
    data: TimeSeriesData | null;
    showLog: boolean;
}

function getPercentageValue(str: string): number {
    return +str.replace("%", "");
}

function getAreaRangePoints(point: any) {
    const parts = point.series.name.split(" to ");
    const lowText = parts[0];
    const highText = parts[1];

    return [
        { key: getPercentageValue(lowText), value: point.point.low },
        { key: getPercentageValue(highText), value: point.point.high },
    ];
}

function getLinePoint(point: any) {
    return { key: getPercentageValue(point.series.name), value: point.y };
}

const createHighChartOptions = (
    contactData: ContactData,
    timeSeriesData: number[],
    maxValue: number,
    type: string,
    index: number,
    showLog: boolean
): Highcharts.Options => {
    const title = getContactText(contactData.contact);
    const typeText = typeOptions.find((_) => _.key === type)?.text;
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
        },

        yAxis: {
            minorTickInterval: 0.1,
            title: {
                text: typeText,
            },
            max: maxValue,
            min: showLog ? 1 : 0,
            type: showLog ? "logarithmic" : "linear",
        },

        tooltip: {
            crosshairs: true,
            shared: true,
            formatter: function () {
                const points = [
                    ...getAreaRangePoints(this.points[0]),
                    ...getAreaRangePoints(this.points[1]),
                    getLinePoint(this.points[2]),
                ];
                const date = this.points[0].x;
                const dateText = Highcharts.dateFormat("%A, %b %d", date);
                points.sort((a, b) => b.key - a.key);
                return [
                    `<div style="font-size:.9em">${dateText}</div>`,
                    ...points.map(
                        (p) =>
                            `<div>${p.key}%:\t${Highcharts.numberFormat(
                                p.value,
                                0,
                                ".",
                                " "
                            )}</div>`
                    ),
                ].join("<br/>");
            },
        } as any,

        legend: {
            enabled: false,
        },

        credits: {
            enabled: false,
        },

        responsive: {
            rules: [],
        },

        series: toProjectionData(contactData, timeSeriesData, index, showLog),
    };
};

export class Projection extends React.Component<
    AreaRangeProps,
    AreaRangeState
> {
    public constructor(props: AreaRangeProps) {
        super(props);
        this.state = {
            data: null,
            showLog: false,
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
        const data = this.state.data;
        if (data === null) return null;
        const optionsForAllCharts = data.contactData.map((d, i) =>
            createHighChartOptions(
                d,
                data.timeSeries,
                data.maxValue,
                this.props.type,
                i,
                this.state.showLog
            )
        );
        return this.renderCharts(optionsForAllCharts);
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
                <div className="log-control-row">
                    <Toggle
                        className="toggle-show-low"
                        label="Show Log"
                        inlineLabel
                        onText="On"
                        offText="Off"
                        checked={this.state.showLog}
                        onChange={(e, checked) =>
                            this.setState({ showLog: !!checked })
                        }
                        styles={{ root: { marginBottom: 0 } }}
                    />
                </div>
                <div className="projection-charts row">
                    {optionsList.map((options) => (
                        <div
                            className={`col-xs-12 ${
                                this.props.contactsCnt === 3
                                    ? "col-sm-4 col-md-4 col-lg-4"
                                    : "col-sm-6 col-md-6 col-lg-3"
                            }`}
                            key={options.title?.text}
                        >
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={options}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    private async loadData() {
        const data = await getTimeSeriesData({
            type: this.props.type,
            stateCode: this.props.stateCode,
        });
        if (data) {
            data.contactData.sort((a, b) => +b.contact - +a.contact);
            this.setState({ data });
        }
    }
}
