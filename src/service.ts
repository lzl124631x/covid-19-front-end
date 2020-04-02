import axios from "axios";
import { MapData } from "./type";

const backendUrl = `${window.location.protocol}//${window.location.hostname}:6789`;

export const getMap = async (options: { field: string; contact: string }) => {
    try {
        const response = await axios.get(`${backendUrl}/map`, {
            params: options
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
