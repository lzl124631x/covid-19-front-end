import axios from "axios";
import { StackedChartData } from "./stackedchart/StackedChartData";
import { MapData } from "./type";
import { AreaRangeData } from "./projection/type";

const backendUrl = `${window.location.protocol}//${window.location.hostname}:6789`;

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

export const getRangeData = async (options: {
    type: string;
    stateCode: string;
}): Promise<AreaRangeData[] | undefined> => {
    try {
        const response = await axios.get(
            `${backendUrl}/range-timeseries-data`,
            {
                params: options,
            }
        );
        return response.data;
    } catch (err) {
        alert(err);
    }
};
