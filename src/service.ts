import axios from "axios";
import { StackedChartData } from "./stackedchart/StackedChartData";
import { MapData } from "./type";
import { TimeSeriesData } from "./projection/type";

const backendUrl = `${window.location.protocol}//${window.location.hostname}:6789`;

export const getContacts = async () => {
    try {
        const response = await axios.get(`${backendUrl}/contacts`);
        return response.data as string[];
    } catch (err) {
        alert(err);
    }
};

export const getMap = async (options: { field: string; contact: string }) => {
    try {
        const response = await axios.get(`${backendUrl}/map`, {
            params: options,
        });
        return response.data as MapData;
    } catch (err) {
        alert(err);
    }
};

export const getDates = async () => {
    try {
        const response = await axios.get(`${backendUrl}/dates`);
        return response.data;
    } catch (err) {
        alert(err);
    }
};

export const getStackedChart = async (options: {
    contact: string;
    type: string;
    stateCode: string;
}): Promise<StackedChartData[] | undefined> => {
    try {
        const response = await axios.get(`${backendUrl}/stacked-chart`, {
            params: options,
        });
        return response.data;
    } catch (err) {
        alert(err);
    }
};

export const getTimeSeriesData = async (options: {
    type: string;
    stateCode: string;
}): Promise<TimeSeriesData | undefined> => {
    try {
        const response = await axios.get(`${backendUrl}/timeseries-data`, {
            params: options,
        });
        return response.data;
    } catch (err) {
        alert(err);
    }
};
