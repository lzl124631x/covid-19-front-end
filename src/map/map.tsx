import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import { mapData } from "../us";
import { getMap, getDates } from "../service";
import React, { useEffect, useState, useRef } from "react";
import "./map.sass";
import { MapData } from "../type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { useInterval } from "../util";
import { Slider } from "@fluentui/react";

const types = [
    { value: "hosp_need", text: "Bed" },
    { value: "ICU_need", text: "ICU" },
    { value: "vent_need", text: "Ventilator" },
    { value: "death", text: "Death" },
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

    const typeText = types.find(({ value }) => value === type)?.text;
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
                <label>
                    <div className="label-title">Type</div>
                    <select
                        className="map-control"
                        value={type}
                        onChange={e => setType(e.target.value)}
                    >
                        {types.map(({ value, text }) => (
                            <option value={value} key={value}>
                                {text}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    <div className="label-title">Percentile</div>
                    <select
                        className="map-control"
                        value={percentile}
                        onChange={e => setPercentile(e.target.value)}
                    >
                        <option value="2.5">2.5</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="75">75</option>
                        <option value="97.5">97.5</option>
                    </select>
                </label>
                <label>
                    <div className="label-title">Social Distancing</div>
                    <select
                        className="map-control"
                        value={contact}
                        onChange={e => setContact(e.target.value)}
                    >
                        {[
                            { val: "50", text: "50% contact" },
                            { val: "75", text: "75% contact" },
                            { val: "100", text: "No intervention" },
                        ].map(({ val, text }) => (
                            <option value={val} key={val}>
                                {text}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                constructorType={"mapChart"}
            />
            <div className="date-control">
                <div className="date-text-row">
                    <div className="date-text">Date: {date}</div>
                    <button
                        className="btn"
                        onClick={() => setPlaying(prev => !prev)}
                    >
                        <FontAwesomeIcon icon={playing ? faPause : faPlay} />
                    </button>
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
