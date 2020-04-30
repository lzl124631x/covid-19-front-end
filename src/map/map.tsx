import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import { geoData } from "../geo/us";
import waGeo from "../geo/wa";
import alGeo from "../geo/al";
import azGeo from "../geo/az";
import { getMap, getDates } from "../service";
import React, { useEffect, useState, useRef } from "react";
import "./map.sass";
import { MapData } from "../type";
import { useInterval, fixDataForLog } from "../util";
import { Slider, Toggle } from "@fluentui/react";
import { typeOptions } from "../constants";
import { MapProps } from "./type";
import drilldown from "highcharts/modules/drilldown";
drilldown(Highcharts);

const geoJson = Highcharts.geojson(geoData);
geoJson.forEach((d, i) => {
    d.drilldown = d.properties["hc-key"];
});

export function Map({ type, contact, onStateClicked, showLog }: MapProps) {
    const [data, setData] = useState<MapData>();
    const percentile = "50"; // Hiding percentile for map for now
    const [dates, setDates] = useState<string[]>([]);
    const [dateIndex, setDateIndex] = useState<number>(0);
    const [playing, setPlaying] = useState(true);
    const [selectedState, setSelectedState] = useState("");
    const [stateData, setStateData] = useState<any[]>();
    const field = `${type}_${percentile}`;
    const date = dates[dateIndex];
    useInterval(
        () => {
            setDateIndex((prev) => (prev + 1) % dates.length);
        },
        playing ? 500 : null
    );

    useEffect(() => {
        (async () => {
            const ds = await getDates();
            setDates(ds);
            setDateIndex(0);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (!contact) return;
            setData(await getMap({ field, contact }));
            setDateIndex(0);
        })();
    }, [field, contact]);

    const typeText = typeOptions.find(({ key }) => key === type)?.text;

    const options: Highcharts.Options = {
        title: {
            text: "",
        },
        chart: {
            backgroundColor: "#F7F7F7",
            height: 500,
            borderRadius: 5,
            events: {
                drilldown: function (e) {
                    if (e.seriesOptions) return;
                    const chart = this;
                    const state = (e.point as any).drilldown;
                    console.log("drilldown", state);
                    setPlaying(false);
                    let geo: any;
                    if (state === "us-wa") geo = waGeo;
                    else if (state === "us-al") geo = alGeo;
                    else geo = azGeo;
                    const data = Highcharts.geojson(geo);
                    data.forEach((d) => (d.value = 1));
                    // setPlaying(false);
                    setStateData(data);
                    chart.addSeriesAsDrilldown(e.point, {
                        id: state.drilldown,
                        name: e.point.name,
                        data: data,
                        dataLabels: {
                            enabled: true,
                            format: "{point.name}",
                        },
                    } as any);
                    var ddCurrent = (chart.series[0] as any).userOptions.id;
                    var ddSeries = (chart.options.drilldown as any).series;
                    console.log(ddCurrent, ddSeries);
                    setSelectedState(state);
                },
            },
        },
        responsive: {
            rules: [],
        },
        drilldown: {
            activeDataLabelStyle: {
                color: "black",
                textDecoration: "none",
            },
            drillUpButton: {
                relativeTo: "spacingBox",
                position: {
                    x: 0,
                    y: 60,
                },
            },
        },

        series: [
            {
                mapData: geoJson,
                name: typeText,
                data: [],
                dataLabels: {
                    enabled: true,
                    color: "black",
                    format: "{point.name}",
                },
                states: {
                    hover: {
                        // TODO: show effect when it's hovered.
                    },
                },
                // point: {
                //     events: {
                //         click: function () {
                //             const state = (this as any).properties[
                //                 "postal-code"
                //             ];
                //             onStateClicked(state);
                //         },
                //     },
                // },
                cursor: "pointer",
                tooltip: {
                    footerFormat:
                        '<span style="font-size: 10px">(Click to see projection for this state)</span>',
                },
            } as any,
        ],
        colorAxis: {},
    };

    const chartRef = useRef<Highcharts.Chart>();

    useEffect(() => {
        const chart = chartRef.current;
        if (!chart) return;
        if (selectedState) {
            var ddCurrent = chart.series[0];
            var ddSeries = (chart.options.drilldown as any).series;
            console.log(ddCurrent, ddSeries);
            return;
        }
        const dateData = data?.data.find((d) => d[0] === date) || [];
        let series = [...(dateData[1] || [])];
        if (showLog) {
            series.forEach((d) => (d[1] = fixDataForLog(d[1])));
        }
        const maxValue = data?.maxValue || 0;
        chart.update({
            // colorAxis: {
            //     min: showLog ? 1 : 0,
            //     max: maxValue,
            //     type: showLog ? "logarithmic" : "linear",
            //     stops: showLog
            //         ? [
            //               [0, "#FFFFFF"],
            //               [0.5, "#FFC100"],
            //               [0.75, "#FF9900"],
            //               [0.875, "#FF7400"],
            //               [1, "#FF0000"],
            //           ]
            //         : [
            //               [0, "#FFFFFF"],
            //               [0.25, "#FFC100"],
            //               [0.5, "#FF9900"],
            //               [0.75, "#FF7400"],
            //               [1, "#FF0000"],
            //           ],
            // },
            series: [{ data: series } as any],
            // drilldown: {
            //     series: [
            //         {
            //             id: "us-wa",
            //             data: stateData,
            //         } as any,
            //     ],
            // },
        });
    }, [selectedState, showLog, data, date]);

    return (
        <div className="map">
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                constructorType={"mapChart"}
                allowChartUpdate={false}
                ref={(r) => (chartRef.current = r?.chart)}
            />
            <div className="date-control">
                <div className="date-text-row">
                    <div className="date-text">Date: {date}</div>
                    <Toggle
                        className="toggle-autoplay"
                        label="Autoplay"
                        inlineLabel
                        onText="On"
                        offText="Off"
                        checked={playing}
                        onChange={(e, checked) => setPlaying(!!checked)}
                        styles={{ root: { marginBottom: 0 } }}
                    />
                </div>
                <Slider
                    min={0}
                    max={dates.length - 1}
                    className="date-slider"
                    value={dateIndex}
                    onChange={setDateIndex}
                    showValue={false}
                    snapToStep
                />
            </div>
        </div>
    );
}
