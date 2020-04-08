import * as React from "react";
import * as Highcharts from "highcharts";
import more from "highcharts/highcharts-more";
import HighchartsReact from "highcharts-react-official";
import { getTimeSeriesData } from "../service";
import { ContactData } from "./type";
import { toProjectionData } from "./util";
import { typeOptions, stateCodeOptions } from "../constants";
import "./projection.sass";
import { getContactText } from "../util";
more(Highcharts);

interface AreaRangeProps {
    type: string;
    stateCode: string;
}

interface AreaRangeState {
    optionsForAllCharts: Highcharts.Options[];
}

const createHighChartOptions = (
    contactData: ContactData,
    timeSeriesData: number[],
    maxValue: number,
    type: string,
    index: number
): Highcharts.Options => {
    const contact = contactData.contact.replace("data", "");
    const title = getContactText(contact);
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
            min: 0,
        },

        tooltip: {
            crosshairs: true,
            shared: true,
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

        series: toProjectionData(contactData, timeSeriesData, index),
    };
};

export class Projection extends React.Component<
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
                <div className="projection-charts row">
                    {optionsList.map((options) => (
                        <div
                            className="col-xs-12 col-sm-4 col-md-4 col-lg-4"
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
            const optionsForAllCharts = data.contactData.map((d, i) =>
                createHighChartOptions(
                    d,
                    data.timeSeries,
                    data.maxValue,
                    this.props.type,
                    i
                )
            );
            this.setState({ optionsForAllCharts });
        }
    }
}
