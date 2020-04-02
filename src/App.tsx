import React from "react";
import "./App.sass";
import { Map } from "./map/map";
import StackedChart from "./stackedchart/StackedChart";

function App() {
    return (
        <div className="App">
            <Map />
            <StackedChart />
        </div>
    );
}

export default App;
