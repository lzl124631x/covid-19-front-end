import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import { mapData } from "../us";
import { getMap } from "../service";
import React, { useEffect, useState } from "react";

export function Map() {
    const [data, setData] = useState<any>([]);
    const [date, setDate] = useState<string>("04/01/20");
    const [type, setType] = useState<string>("hosp_need");
    const [percentile, setPercentile] = useState<string>("50");
    const field = `${type}_${percentile}`;

    useEffect(() => {
        (async () => {
            setData(await getMap({ date, field }));
        })();
    }, [field]);

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
        <>
            <select value={type} onChange={e => setType(e.target.value)}>
                <option value="hosp_need">Bed</option>
                <option value="ICU_need">ICU</option>
                <option value="vent_need">Ventilator</option>
                <option value="death">Death</option>
            </select>
            <select
                value={percentile}
                onChange={e => setPercentile(e.target.value)}
            >
                <option value="2.5">2.5</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="75">75</option>
                <option value="97.5">97.5</option>
            </select>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                constructorType={"mapChart"}
            />
        </>
    );
}
