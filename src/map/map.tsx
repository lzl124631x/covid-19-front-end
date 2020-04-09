import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import { geoData } from "../us";
import { getMap, getDates } from "../service";
import React, { useEffect, useState } from "react";
import "./map.sass";
import { MapData } from "../type";
import { useInterval, fixDataForLog } from "../util";
import { Slider, Toggle } from "@fluentui/react";
import { typeOptions } from "../constants";
import { MapProps } from "./type";

export function Map({ type, contact, onStateClicked }: MapProps) {
    const [data, setData] = useState<MapData>();
    const percentile = "50"; // Hiding percentile for map for now
    // const [percentile, setPercentile] = useState<string>("50");
    const [dates, setDates] = useState<string[]>([]);
    const [dateIndex, setDateIndex] = useState<number>(0);
    const [playing, setPlaying] = useState(true);
    const showLog = false;
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
    const dateData = data?.data.find((d) => d[0] === date) || [];
    let series = [...(dateData[1] || [])];
    if (showLog) {
        series.forEach((d) => (d[1] = fixDataForLog(d[1])));
    }
    const maxValue = data?.maxValue || 0;
    const options: Highcharts.Options = {
        title: {
            text: "",
        },
        chart: {
            backgroundColor: "#F7F7F7",
            height: 500,
            borderRadius: 5,
        },
        colorAxis: {
            min: showLog ? 1 : 0,
            max: maxValue,
            type: showLog ? "logarithmic" : "linear",
            stops: [
                [0, "#FFFFFF"],
                // [0.5, "#FFA500"],
                [1, "#65000b"],
            ],
        },

        series: [
            {
                mapData: geoData,
                name: typeText,
                data: series,
                dataLabels: {
                    enabled: true,
                    format: "{point.name}",
                },
                states: {
                    hover: {
                        // TODO: show effect when it's hovered.
                    },
                },
                point: {
                    events: {
                        click: function () {
                            const state = (this as any).properties[
                                "postal-code"
                            ];
                            onStateClicked(state);
                        },
                    },
                },
                cursor: "pointer",
                tooltip: {
                    footerFormat:
                        '<span style="font-size: 10px">(Click to see projection for this state)</span>',
                },
            } as any,
        ],
        responsive: {
            rules: [],
        },
    };
    return (
        <div className="map">
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                constructorType={"mapChart"}
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
