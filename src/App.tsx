import React from "react";
import "./App.sass";
import { Map } from "./map/map";
import StackedChart from "./stackedchart/StackedChart";
import { Dropdown } from "@fluentui/react";

interface AppState {
    type: string;
    contact: string;
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

export class App extends React.Component<{}, AppState> {
    public constructor(props: {}) {
        super(props);
        this.state = {
            contact: "50",
            type: "hosp_need",
        };
    }
    public render() {
        return (
            <div className="App">
                <div className="container">
                    <div className="app-header">COVID-19 Projection</div>
                    <div>
                        <Dropdown
                            dropdownWidth={100}
                            styles={{ dropdown: { width: 100 } }}
                            selectedKey={this.state.type}
                            options={typeOptions}
                            label="Type"
                            onChange={(e, item) =>
                                this.setType(item?.key as string)
                            }
                        />
                        <Dropdown
                            dropdownWidth={100}
                            styles={{ dropdown: { width: 100 } }}
                            selectedKey={this.state.contact}
                            options={contactOptions}
                            label="Social Distancing"
                            onChange={(e, item) =>
                                this.setContact(item?.key as string)
                            }
                        />
                    </div>
                    <Map/>
                    <StackedChart
                        type={this.state.type}
                        contact={this.state.contact}
                    />
                </div>
            </div>
        );
    }

    private setContact(contact: string) {
        this.setState({ contact });
    }

    private setType(type: string) {
        this.setState({ type });
    }
}
