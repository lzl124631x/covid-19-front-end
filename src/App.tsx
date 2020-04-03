import React, { useState, useEffect } from "react";
import "./App.sass";
import { Map } from "./map/map";
import StackedChart from "./stackedchart/StackedChart";
import { Dropdown } from "@fluentui/react";

const stateCodeOptions = [
    { text: "Alabama ", key: "AL" },
    { text: "Arizona ", key: "AZ" },
    { text: "Arkansas ", key: "AR" },
    { text: "California ", key: "CA" },
    { text: "Colorado ", key: "CO" },
    { text: "Connecticut ", key: "CT" },
    { text: "Delaware ", key: "DE" },
    { text: "District of Columbia ", key: "DC" },
    { text: "Florida ", key: "FL" },
    { text: "Georgia ", key: "GA" },
    { text: "Idaho ", key: "ID" },
    { text: "Illinois ", key: "IL" },
    { text: "Indiana ", key: "IN" },
    { text: "Iowa ", key: "IA" },
    { text: "Kansas ", key: "KS" },
    { text: "Kentucky ", key: "KY" },
    { text: "Louisiana ", key: "LA" },
    { text: "Maine ", key: "ME" },
    { text: "Maryland ", key: "MD" },
    { text: "Massachusetts ", key: "MA" },
    { text: "Michigan ", key: "MI" },
    { text: "Minnesota ", key: "MN" },
    { text: "Mississippi ", key: "MS" },
    { text: "Missouri ", key: "MO" },
    { text: "Montana ", key: "MT" },
    { text: "Nebraska ", key: "NE" },
    { text: "Nevada ", key: "NV" },
    { text: "New Hampshire ", key: "NH" },
    { text: "New Jersey ", key: "NJ" },
    { text: "New Mexico ", key: "NM" },
    { text: "New York ", key: "NY" },
    { text: "North Carolina ", key: "NC" },
    { text: "North Dakota ", key: "ND" },
    { text: "Ohio ", key: "OH" },
    { text: "Oklahoma ", key: "OK" },
    { text: "Oregon ", key: "OR" },
    { text: "Pennsylvania ", key: "PA" },
    { text: "Puerto Rico ", key: "PR" },
    { text: "Rhode Island ", key: "RI" },
    { text: "South Carolina ", key: "SC" },
    { text: "South Dakota ", key: "SD" },
    { text: "Tennessee ", key: "TN" },
    { text: "Texas ", key: "TX" },
    { text: "Utah ", key: "UT" },
    { text: "Vermont ", key: "VT" },
    { text: "Virginia ", key: "VA" },
    { text: "Washington ", key: "WA" },
    { text: "West Virginia ", key: "WV" },
    { text: "Wisconsin ", key: "WI" },
    { text: "Wyoming ", key: "WY" },
];
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
