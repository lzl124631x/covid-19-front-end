import axios from "axios";
import { IStackedChart } from "./stackedchart/IStackedChart";

const backendUrl = `${window.location.protocol}//${window.location.hostname}:6789`;

export const getMap = async (options: {
    date: string;
    field: string;
    contact: string;
}) => {
    try {
        const response = await axios.get(`${backendUrl}/map`, {
            params: options
        });
        return response.data;
    } catch (err) {
        alert(err);
    }
};

export const getStackedChart = async (options: {
    contact: string;
    resourceType: string;
}): Promise<IStackedChart[] | undefined> => {
    try {
        const response = await axios.get(`${backendUrl}/stackedchart`, {
            params: options
        });
        return response.data;
    } catch (err) {
        alert(err);
    }
};
