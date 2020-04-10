import React, { useState, useEffect } from "react";
import "./App.sass";
import { Map } from "./map/map";
import { Dropdown, IDropdownOption, Toggle } from "@fluentui/react";
import { typeOptions } from "./constants";
import { Projection } from "./projection/projection";
import { getContacts } from "./service";
import { getContactText } from "./util";

export function App() {
    const [type, setType] = useState<string>("hosp_need");
    const [contact, setContact] = useState<string>("");
    const [contactOptions, setContactOptions] = useState<IDropdownOption[]>([]);
    const [stateCode, setStateCode] = useState<string>("NY");
    const [showLog, setShowLog] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            const contacts = await getContacts();
            if (!contacts || !contacts.length) return;
            setContactOptions(
                contacts.map((v) => ({
                    key: v,
                    text: getContactText(v),
                }))
            );
            setContact(contacts[0]);
        })();
    }, []);

    return (
        <div className="App">
            <div className="container">
                <div className="app-header">
                    Columbia University COVID-19 Projections
                </div>
                <div className="app-controls">
                    <div className="app-controls-body">
                        <Dropdown
                            className="app-control"
                            dropdownWidth={0}
                            selectedKey={type}
                            options={typeOptions}
                            label="Type"
                            onChange={(e, item) => setType(item?.key as string)}
                        />
                        <Dropdown
                            className="app-control"
                            dropdownWidth={0}
                            selectedKey={contact}
                            options={contactOptions}
                            label="Social Distancing"
                            onChange={(e, item) =>
                                setContact(item?.key as string)
                            }
                        />
                    </div>
                    <Toggle
                        className="toggle-show-log"
                        label="Show Log"
                        inlineLabel
                        onText="On"
                        offText="Off"
                        checked={showLog}
                        onChange={(e, checked) => setShowLog(!!checked)}
                        styles={{ root: { marginBottom: 0 } }}
                    />
                </div>
                <Map
                    type={type}
                    contact={contact}
                    onStateClicked={setStateCode}
                    showLog={showLog}
                />

                <Projection
                    type={type}
                    stateCode={stateCode}
                    showLog={showLog}
                    contactsCnt={contactOptions.length}
                />
            </div>
        </div>
    );
}
