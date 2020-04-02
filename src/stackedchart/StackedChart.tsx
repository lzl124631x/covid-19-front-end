import * as React from 'react';
import * as ReactDom from 'react-dom';
import { render } from 'react-dom';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import more from 'highcharts/highcharts-more';
import { getStackedChart } from '../service';
import { IStackedChart } from './IStackedChart';
import "./StackedChart.css";
more(Highcharts);


const optionsDeletgate = (stackedChartData: IStackedChart): Highcharts.Options => {
    return {
        chart: {
            type: 'areaspline'
        },
        title: {
            text: stackedChartData.title,
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 150,
            y: 100,
            floating: true,
            borderWidth: 1,
            backgroundColor: '#FFFFFF'
        },
        xAxis: {
            categories: stackedChartData.categories,
            plotBands: [{ // visualize the weekend
                from: 4.5,
                to: 6.5,
                color: 'rgba(68, 170, 213, .2)'
            }],
            title: {
                text: stackedChartData.xAxisLabel,
            }
        },
        yAxis: {
            title: {
                text: stackedChartData.yAxisLabel,
            }
        },
        tooltip: {
            shared: true,
            valueSuffix: ' units'
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            areaspline: {
                fillOpacity: 0.1
            }
        },
        series: stackedChartData.series as any
    }
}

interface IStackedChartProps {

}

interface IStackedChartState {
    options: Highcharts.Options;
    percentile: string;
    resourceType: string;
}

export default class StackedChart extends
    React.Component<IStackedChartProps, IStackedChartState> {

    constructor(props: IStackedChartProps) {
        super(props);
        this.state = {
            options: {},
            percentile: "50",
            resourceType: "beds",
        }
    }
    public async componentDidMount() {
        await this.loadData();
    }
    public render() {
        const options = this.state.options;
        if (options == {}) {
            return <div> Loading </div>;
        }
        else {
            return (<div className="chart-container" style={{ width: "50%" }}>
                <div className="intervention-selection">
                    <select
                        className="map-control"
                        value={this.state.percentile}
                        onChange={e => this.setPercentile(e.target.value)}
                    >
                        <option value="50">50% contact</option>
                        <option value="75">75% contact</option>
                        <option value="100">No intervention</option>
                    </select>
                    <select
                        className="map-control"
                        value={this.state.resourceType}
                        onChange={e => this.setResourceType(e.target.value)}
                    >
                        <option value="beds">Bed</option>
                        <option value="icus">ICU</option>
                        <option value="ventilators">Ventilator</option>
                        <option value="deaths">Death</option>
                    </select>
                </div>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                />
            </div>);
        }
    }

    private async loadData() {
        const data = await getStackedChart({
            contact: this.state.percentile,
            resourceType: this.state.resourceType
        });
        if (data != null) {
            const options = optionsDeletgate(data[0]);
            this.setState({ options });
        }
    }

    private setPercentile(percentile: string) {
        this.setState({ percentile }, this.loadData);
    }

    private setResourceType(resourceType: string) {
        this.setState({ resourceType }, this.loadData);
    }
}
