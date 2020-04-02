import React from "react";
import "./App.sass";
import { Map } from "./map/map";

function App() {
    return (
        <div className="App">
            <div className="container">
                <div className="app-header">COVID-19 Projection</div>
                <Map />
            </div>
        </div>
    );
}

export default App;
