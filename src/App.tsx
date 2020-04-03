import React, { useState, useEffect } from "react";
import "./App.sass";
import { Map } from "./map/map";
import StackedChart from "./stackedchart/StackedChart";
import { Dropdown, IDropdownOption } from "@fluentui/react";
import { getFipsData } from "./service";
import { toFipsOptions } from "./util";

interface AppState {
    type: string;
    contact: string;
    fipsKeyForState: string;
    fipsOptions: IDropdownOption[];
}

const typeOptions = [
    { key: "hosp_need", text: "Bed" },
    { key: "ICU_need", text: "ICU" },
    { key: "vent_need", text: "Ventilator" },
    { key: "death", text: "Death" },
];

const contactOptions = [
    { key: "50", text: "50% contact" },
    { key: "75", text: "75% contact" },
    { key: "100", text: "No intervention" },
];

export function App() {
    const [type, setType] = useState<string>("hosp_need");
    const [contact, setContact] = useState<string>("50");
    const [fipsKeyForState, setFipsKeyForState] = useState<string>("53");
    const [fipsOptions, setFipsOptions] = useState<IDropdownOption[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const fipsData = await getFipsData();
            if (fipsData != null) {
                setFipsOptions(toFipsOptions(fipsData));
            }
        };
        fetchData();
    }, []);

    return (
        <div className="App">
            <div className="container">
                <div className="app-header">COVID-19 Projection</div>
                <div className="app-controls">
                    <Dropdown
                        className="app-control"
                        dropdownWidth={100}
                        styles={{ dropdown: { width: 100 } }}
                        selectedKey={fipsKeyForState}
                        options={fipsOptions}
                        label="State"
                        onChange={(e, item) =>
                            setFipsKeyForState(item?.key as string)
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
                    fipsKeyForState={fipsKeyForState}
                />
            </div>
        </div>
    );
}
