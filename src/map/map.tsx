import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import { mapData } from "../us";
import { getMap, getDates } from "../service";
import React, { useEffect, useState } from "react";
import "./map.sass";

const types = [
    { value: "hosp_need", text: "Bed" },
    { value: "ICU_need", text: "ICU" },
    { value: "vent_need", text: "Ventilator" },
    { value: "death", text: "Death" }
];

export function Map() {
    const [data, setData] = useState<any>([]);
    const [date, setDate] = useState<string>("");
    const [type, setType] = useState<string>("hosp_need");
    const [percentile, setPercentile] = useState<string>("50");
    const [contact, setContact] = useState<string>("50");
    const [dates, setDates] = useState<string[]>([]);
    const field = `${type}_${percentile}`;

    useEffect(() => {
        (async () => {
            const ds = await getDates();
            setDates(ds);
            setDate(ds[0]);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            setData(await getMap({ date, field, contact }));
        })();
    }, [field, date, contact]);

    const typeText = types.find(({ value }) => value === type)?.text;

    const options: Highcharts.Options = {
        title: {
            text: "COVID-19 Projection"
        },

        colorAxis: {
            min: 0
        },

        series: [
            {
                mapData: mapData,
                name: typeText,
                data: data
            } as any
        ]
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
                            <option value={value}>{text}</option>
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
                            { val: "100", text: "No intervention" }
                        ].map(({ val, text }) => (
                            <option value={val} key={val}>
                                {text}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    <div className="label-title">Date</div>
                    <select
                        className="map-control"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                    >
                        {dates.map(d => (
                            <option value={d} key={d}>
                                {d}
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
        </div>
    );
}
