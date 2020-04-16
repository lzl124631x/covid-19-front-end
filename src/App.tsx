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
                <div className="app-footer">
                    <p>Provided with ❤️ by</p>
                    <p className="info-row">
                        <i>
                            Columbia University Mailman School of Public Health
                            Team
                        </i>
                        : Sen Pei, Sasikiran Kandula, Wan Yang, Teresa Yamana,
                        Marta Galanti, Jeffrey Shaman
                    </p>
                    <p className="info-row">
                        <i>Microsoft Corporation</i>:{" "}
                        <a target="_blank" href="https://liuzhenglai.com">
                            Richard Liu
                        </a>
                        ,{" "}
                        <a
                            target="_blank"
                            href="https://www.linkedin.com/in/supramo"
                        >
                            Sai Upadhyayula
                        </a>
                        , Jenny Ye, Zhangwei Xu
                    </p>
                    <p className="info-row">
                        <i>Source of Underlying County-level Data</i>:{" "}
                        <a
                            target="_blank"
                            href=" https://usafacts.org/visualizations/coronavirus-covid-19-spread-map/"
                        >
                            USAFACTS
                        </a>
                    </p>
                    <p className="copyright">© 2020 Shaman Lab</p>
                </div>
            </div>
        </div>
    );
}
