import * as React from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import more from "highcharts/highcharts-more";
import { getStackedChart } from "../service";
import { StackedChartDataForHiChart } from "./StackedChartData";
import "./StackedChart.sass";
import { toHighChartData } from "../util";
import { Spinner, SpinnerSize } from "@fluentui/react";
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
}

interface IStackedChartState {
    options: Highcharts.Options;
}

export default class StackedChart extends React.Component<
    IStackedChartProps,
    IStackedChartState
> {
    constructor(props: IStackedChartProps) {
        super(props);
        this.state = {
            options: {},
        };
    }
    public async componentDidMount() {
        await this.loadData();
    }
    public render() {
        const options = this.state.options;
        if (Object.keys(options).length == 0) {
            return <Spinner size={SpinnerSize.medium} />;
        } else {
            return (
                <div className="chart-container">
                    <div className="intervention-selection">
                        
                    </div>
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
        });
        if (data != null) {
            const options = optionsDeletgate(toHighChartData(data[0]));
            this.setState({ options });
        }
    }
}
