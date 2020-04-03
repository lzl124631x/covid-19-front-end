import React from "react";
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

export class App extends React.Component<{}, AppState> {
    public constructor(props: {}) {
        super(props);
        this.state = {
            contact: "50",
            type: "hosp_need",
            fipsKeyForState: "53",
            fipsOptions: [],
        };
    }

    public async componentDidMount() {
        const data = await getFipsData();
        if (data != null) {
            const fipsOptions = toFipsOptions(data);
            this.setState({ fipsOptions });
        }
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
                            selectedKey={this.state.fipsKeyForState}
                            options={this.state.fipsOptions}
                            label="State"
                            onChange={(e, item) =>
                                this.setFipsKeyForState(item?.key as string)
                            }
                        />
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
                        fipsKeyForState={this.state.fipsKeyForState}
                    />
                </div>
            </div>
        );
    }

    private setFipsKeyForState(fipsKeyForState: string) {
        console.log(fipsKeyForState);
        this.setState({ fipsKeyForState });
    }

    private setContact(contact: string) {
        this.setState({ contact });
    }

    private setType(type: string) {
        this.setState({ type });
    }
}
