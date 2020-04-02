import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import { mapData } from "../us";
import { getMap, getDates } from "../service";
import React, { useEffect, useState, useRef } from "react";
import "./map.sass";
import { MapData } from "../type";
import { useInterval } from "../util";
import { Slider, Dropdown, CommandButton } from "@fluentui/react";

const typeOptions = [
    { key: "hosp_need", text: "Bed" },
    { key: "ICU_need", text: "ICU" },
    { key: "vent_need", text: "Ventilator" },
    { key: "death", text: "Death" },
];

const percentileOptions = [
    { key: "2.5", text: "2.5" },
    { key: "25", text: "25" },
    { key: "50", text: "50" },
    { key: "75", text: "75" },
    { key: "97.5", text: "97.5" },
];

const contactOptions = [
    { key: "50", text: "50% contact" },
    { key: "75", text: "75% contact" },
    { key: "100", text: "No intervention" },
];

export function Map() {
    const [data, setData] = useState<MapData>();
    const [type, setType] = useState<string>("hosp_need");
    const [percentile, setPercentile] = useState<string>("50");
    const [contact, setContact] = useState<string>("50");
    const [dates, setDates] = useState<string[]>([]);
    const [dateIndex, setDateIndex] = useState<number>(0);
    const [playing, setPlaying] = useState(true);
    const field = `${type}_${percentile}`;
    const date = dates[dateIndex];
    useInterval(
        () => {
            setDateIndex(prev => (prev + 1) % dates.length);
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
            setData(await getMap({ field, contact }));
            setDateIndex(0);
        })();
    }, [field, contact]);

    const typeText = typeOptions.find(({ key }) => key === type)?.text;
    const dateData = data?.data.find(d => d[0] === date) || [];
    const series = [...(dateData[1] || [])];
    const maxValue = data?.maxValue || 0;
    const options: Highcharts.Options = {
        title: {
            text: "COVID-19 Projection",
        },
        chart: {
            backgroundColor: "#F7F7F7",
            height: 500,
        },
        colorAxis: {
            min: 0,
            max: maxValue,
            stops: [
                [0, "#FFFFFF"],
                [0.5, "#F49F82"],
                [1, "#500007"],
            ],
        },

        series: [
            {
                mapData: mapData,
                name: typeText,
                data: series,
                dataLabels: {
                    enabled: true,
                    format: "{point.name}",
                },
            } as any,
        ],
        responsive: {
            rules: [],
        },
    };
    return (
        <div className="map">
            <div className="map-controls">
                <Dropdown
                    className="map-control"
                    dropdownWidth={100}
                    styles={{ dropdown: { width: 100 } }}
                    selectedKey={type}
                    options={typeOptions}
                    label="Type"
                    onChange={(e, item) => setType(item?.key as string)}
                />
                <Dropdown
                    className="map-control"
                    dropdownWidth={100}
                    styles={{ dropdown: { width: 100 } }}
                    selectedKey={percentile}
                    options={percentileOptions}
                    label="Percentile"
                    onChange={(e, item) => setPercentile(item?.key as string)}
                />
                <Dropdown
                    className="map-control"
                    dropdownWidth={150}
                    styles={{ dropdown: { width: 150 } }}
                    selectedKey={contact}
                    options={contactOptions}
                    label="Social Distancing"
                    onChange={(e, item) => setContact(item?.key as string)}
                />
            </div>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                constructorType={"mapChart"}
            />
            <div className="date-control">
                <div className="date-text-row">
                    <div className="date-text">Date: {date}</div>
                    <CommandButton
                        iconProps={{ iconName: playing ? "Pause" : "Play" }}
                        onClick={() => setPlaying(prev => !prev)}
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
