import React, { useState, useEffect } from "react";
import "./App.sass";
import { Map } from "./map/map";
import StackedChart from "./stackedchart/StackedChart";
import { Dropdown } from "@fluentui/react";
import { stateCodeOptions, typeOptions, contactOptions } from "./constants";

export function App() {
    const [type, setType] = useState<string>("hosp_need");
    const [contact, setContact] = useState<string>("50");
    const [stateCode, setStateCode] = useState<string>("WA");

    return (
        <div className="App">
            <div className="container">
                <div className="app-header">COVID-19 Projection</div>
                <div className="app-controls">
                    <Dropdown
                        className="app-control"
                        dropdownWidth={100}
                        styles={{ dropdown: { width: 100 } }}
                        selectedKey={stateCode}
                        options={stateCodeOptions}
                        label="State"
                        onChange={(e, item) =>
                            setStateCode(item?.key as string)
                        }
                    />
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
                <Map type={type} contact={contact} />
                <StackedChart
                    type={type}
                    contact={contact}
                    stateCode={stateCode}
                />
            </div>
        </div>
    );
}
