import React, { useEffect, useState } from "react";
import "./App.sass";
import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import { mapData } from "./us";
import { getMap } from "./service";

function App() {
    const [data, setData] = useState<any>([]);
    const [date, setDate] = useState<string>("04/01/20");
    useEffect(() => {
        (async () => {
            setData(await getMap(date));
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
        <div className="App">
            <header className="App-header">
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                    constructorType={"mapChart"}
                />
            </header>
        </div>
    );
}

export default App;
