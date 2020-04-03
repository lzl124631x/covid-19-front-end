import React, { useState, useEffect } from "react";
import "./App.sass";
import { Map } from "./map/map";
import StackedChart from "./stackedchart/StackedChart";
import { Dropdown } from "@fluentui/react";

const stateNameOptions = [
    { text: "Alabama ", key: "AL" },
    { text: "Alaska ", key: "AK" },
    { text: "American Samoa ", key: "AS" },
    { text: "American Samoa ", key: "" },
    { text: "Arizona ", key: "AZ" },
    { text: "Arkansas ", key: "AR" },
    { text: "Baker Island ", key: "BI" },
    { text: "California ", key: "CA" },
    { text: "Canal Zone ", key: "Canal Zone" },
    { text: "Colorado ", key: "CO" },
    { text: "Connecticut ", key: "CT" },
    { text: "Delaware ", key: "DE" },
    { text: "District of Columbia ", key: "DC" },
    { text: "Florida ", key: "FL" },
    { text: "Federated States of Micronesia ", key: "FM" },
    { text: "Georgia ", key: "GA" },
    { text: "Guam ", key: "Guam" },
    { text: "Guam ", key: "GU" },
    { text: "Hawaii ", key: "HI" },
    { text: "Howland Island ", key: "HI" },
    { text: "Idaho ", key: "ID" },
    { text: "Illinois ", key: "IL" },
    { text: "Indiana ", key: "IN" },
    { text: "Iowa ", key: "IA" },
    { text: "Jarvis Island ", key: "JI" },
    { text: "Johnston Atoll ", key: "JA" },
    { text: "Kansas ", key: "KS" },
    { text: "Kentucky ", key: "KY" },
    { text: "Kingman Reef ", key: "KR" },
    { text: "Louisiana ", key: "LA" },
    { text: "Maine ", key: "ME" },
    { text: "Marshall Islands ", key: "MH" },
    { text: "Maryland ", key: "MD" },
    { text: "Massachusetts ", key: "MA" },
    { text: "Michigan ", key: "MI" },
    { text: "Midway Islands ", key: "MI" },
    { text: "Minnesota ", key: "MN" },
    { text: "Mississippi ", key: "MS" },
    { text: "Missouri ", key: "MO" },
    { text: "Montana ", key: "MT" },
    { text: "Navassa Island ", key: "NI" },
    { text: "Nebraska ", key: "NE" },
    { text: "Nevada ", key: "NV" },
    { text: "New Hampshire ", key: "NH" },
    { text: "New Jersey ", key: "NJ" },
    { text: "New Mexico ", key: "NM" },
    { text: "New York ", key: "NY" },
    { text: "North Carolina ", key: "NC" },
    { text: "North Dakota ", key: "ND" },
    { text: "Northern Mariana Islands ", key: "MP" },
    { text: "Ohio ", key: "OH" },
    { text: "Oklahoma ", key: "OK" },
    { text: "Oregon ", key: "OR" },
    { text: "Palau ", key: "PW" },
    { text: "Palmyra Atoll ", key: "PA" },
    { text: "Pennsylvania ", key: "PA" },
    { text: "Puerto Rico ", key: "Puerto Rico" },
    { text: "Puerto Rico ", key: "PR" },
    { text: "Rhode Island ", key: "RI" },
    { text: "South Carolina ", key: "SC" },
    { text: "South Dakota ", key: "SD" },
    { text: "Tennessee ", key: "TN" },
    { text: "Texas ", key: "TX" },
    { text: "U.S. Minor Outlying Islands ", key: "UM" },
    { text: "Utah ", key: "UT" },
    { text: "Vermont ", key: "VT" },
    { text: "Virginia ", key: "VA" },
    { text: "Virgin Islandsof the U.S ", key: "Virgin Islandsof the U.S" },
    { text: "Virgin Islandsof the U.S. ", key: "VI" },
    { text: "Wake Island ", key: "WI" },
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
    const [stateName, setStatename] = useState<string>("WA");

    return (
        <div className="App">
            <div className="container">
                <div className="app-header">COVID-19 Projection</div>
                <div className="app-controls">
                    <Dropdown
                        className="app-control"
                        dropdownWidth={100}
                        styles={{ dropdown: { width: 100 } }}
                        selectedKey={stateName}
                        options={stateNameOptions}
                        label="State"
                        onChange={(e, item) =>
                            setStatename(item?.key as string)
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
                    stateName={stateName}
                />
            </div>
        </div>
    );
}
