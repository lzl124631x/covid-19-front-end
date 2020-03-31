import axios from "axios";

export const getMap = async (options: {
    date: string;
    field: string;
    contact: string;
}) => {
    try {
        const response = await axios.get("http://localhost:8080/map", {
            params: options
        });
        return response.data;
    } catch (err) {
        alert(err);
    }
};
