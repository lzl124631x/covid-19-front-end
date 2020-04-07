import React, { useState } from "react";
import "./App.sass";
import { Map } from "./map/map";
import { Dropdown } from "@fluentui/react";
import { typeOptions, contactOptions } from "./constants";
import { Projection } from "./projection/projection";

export function App() {
    const [type, setType] = useState<string>("hosp_need");
    const [contact, setContact] = useState<string>("50");
    const [stateCode, setStateCode] = useState<string>("NY");

    return (
        <div className="App">
            <div className="container">
                <div className="app-header">COVID-19 Projection</div>
                <div className="app-controls">
                    <Dropdown
                        className="app-control"
                        dropdownWidth={100}
                        styles={{ dropdown: { width: 100 } }}
                        selectedKey={type}
                        options={typeOptions}
                        label="Type"
                        onChange={(e, item) => setType(item?.key as string)}
                    />
                    <Dropdown
                        className="app-control"
                        dropdownWidth={150}
                        styles={{ dropdown: { width: 150 } }}
                        selectedKey={contact}
                        options={contactOptions}
                        label="Social Distancing"
                        onChange={(e, item) => setContact(item?.key as string)}
                    />
                </div>
                <Map
                    type={type}
                    contact={contact}
                    onStateClicked={setStateCode}
                />

                <Projection type={type} stateCode={stateCode} />
            </div>
        </div>
    );
}
