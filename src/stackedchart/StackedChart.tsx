import * as React from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import more from "highcharts/highcharts-more";
import { getStackedChart } from "../service";
import { StackedChartDataForHiChart } from "./StackedChartData";
import "./StackedChart.sass";
import { toHighChartData } from "../util";
import {
    Spinner,
    SpinnerSize,
    MessageBar,
    MessageBarType,
} from "@fluentui/react";
more(Highcharts);

const optionsDeletgate = (
    stackedChartData: StackedChartDataForHiChart
): Highcharts.Options => {
    return {
        chart: {
            type: "areaspline",
        },
        title: {
            text: stackedChartData.title,
        },
        legend: {
            layout: "vertical",
            align: "left",
            verticalAlign: "top",
            x: 150,
            y: 100,
            floating: true,
            borderWidth: 1,
            backgroundColor: "#FFFFFF",
        },
        xAxis: {
            categories: stackedChartData.categories,
            title: {
                text: stackedChartData.xAxisLabel,
            },
        },
        yAxis: {
            title: {
                text: stackedChartData.yAxisLabel,
            },
        },
        tooltip: {
            shared: true,
            valueSuffix: " units",
        },
        credits: {
            enabled: false,
        },
        plotOptions: {
            areaspline: {
                fillOpacity: 0.1,
            },
        },
        series: stackedChartData.charts as any,
    };
};

interface IStackedChartProps {
    type: string;
    contact: string;
    stateCode: string;
}

interface IStackedChartState {
    options: Highcharts.Options;
    displayNoDataMessage: boolean;
}

export default class StackedChart extends React.Component<
    IStackedChartProps,
    IStackedChartState
> {
    constructor(props: IStackedChartProps) {
        super(props);
        this.state = {
            options: {},
            displayNoDataMessage: false,
        };
    }

    public async componentDidMount() {
        await this.loadData();
    }

    public async componentDidUpdate(oldProps: IStackedChartProps) {
        if (
            this.props.contact != oldProps.contact ||
            this.props.stateCode != oldProps.stateCode ||
            this.props.type != oldProps.type
        ) {
            this.loadData();
        }
    }

    public render() {
        const options = this.state.options;
        if (this.state.displayNoDataMessage) {
            return <MessageBar
                    className="message-bar"
                    messageBarType={MessageBarType.success}
                    dismissButtonAriaLabel="Close"
                >
                    There are no entries for this selection, please try another
                </MessageBar>;
        } else if (Object.keys(options).length == 0) {
            return <Spinner size={SpinnerSize.medium} />;
        } else {
            return (
                <div className="chart-container">
                    <div className="intervention-selection"></div>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                    />
                </div>
            );
        }
    }

    private async loadData() {
        const data = await getStackedChart({
            contact: this.props.contact,
            type: this.props.type,
            stateCode: this.props.stateCode,
        });
        if (data != null && data[0] != null && data[0].xAxisData.length > 0) {
            const options = optionsDeletgate(toHighChartData(data[0]));
            this.setState({ options, displayNoDataMessage: false });
        } else {
            this.setState({ displayNoDataMessage: true });
        }
    }
}
