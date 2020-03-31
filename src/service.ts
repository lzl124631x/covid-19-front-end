import axios from "axios";

export const getMap = async (date: string) => {
    try {
        const response = await axios.get("http://localhost:8080/map", {
            params: { date }
        });
        return response.data;
    } catch (err) {
        alert(err);
    }
};
