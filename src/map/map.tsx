import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import { mapData } from "../us";
import { getMap } from "../service";
import React, { useEffect, useState } from "react";
import "./map.sass";

const dates = [
    "03/24/20",
    "03/25/20",
    "03/26/20",
    "03/27/20",
    "03/28/20",
    "03/29/20",
    "03/30/20",
    "03/31/20",
    "04/01/20",
    "04/02/20",
    "04/03/20",
    "04/04/20",
    "04/05/20",
    "04/06/20",
    "04/07/20",
    "04/08/20",
    "04/09/20",
    "04/10/20",
    "04/11/20",
    "04/12/20",
    "04/13/20",
    "04/14/20"
];

export function Map() {
    const [data, setData] = useState<any>([]);
    const [date, setDate] = useState<string>("04/01/20");
    const [type, setType] = useState<string>("hosp_need");
    const [percentile, setPercentile] = useState<string>("50");
    const [contact, setContact] = useState<string>("50");
    const field = `${type}_${percentile}`;

    useEffect(() => {
        (async () => {
            setData(await getMap({ date, field, contact }));
        })();
    }, [field, date, contact]);

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
                name: "Hosp",
                data: data
            } as any
        ]
    };
    return (
        <div className="map">
            <div className="map-controls">
                <select
                    className="map-control"
                    value={type}
                    onChange={e => setType(e.target.value)}
                >
                    <option value="hosp_need">Bed</option>
                    <option value="ICU_need">ICU</option>
                    <option value="vent_need">Ventilator</option>
                    <option value="death">Death</option>
                </select>
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
            </div>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                constructorType={"mapChart"}
            />
        </div>
    );
}
