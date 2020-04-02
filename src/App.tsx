import React from "react";
import "./App.sass";
import { Map } from "./map/map";
import StackedChart from "./stackedchart/StackedChart";

function App() {
    return (
        <div className="App">
            <div className="container">
                <div className="app-header">COVID-19 Projection</div>
                <Map />
                <StackedChart />
            </div>
        </div>
    );
}

export default App;
