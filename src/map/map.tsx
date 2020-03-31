import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import { mapData } from "../us";
import { getMap } from "../service";
import React, { useEffect, useState } from "react";

export function Map() {
    const [data, setData] = useState<any>([]);
    const [date, setDate] = useState<string>("04/01/20");
    const [field, setField] = useState<string>("hosp_need_50");

    useEffect(() => {
        (async () => {
            setData(await getMap({ date, field }));
        })();
    }, []);

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
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
            constructorType={"mapChart"}
        />
    );
}
