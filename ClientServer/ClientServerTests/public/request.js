import axios from "axios";
export const request = async (path,method,data) => { 
    try {
        const PORT = process.env.PORT + 1;
        const baseURL = `http://localhost:${PORT}`
        path = baseURL + path;
        console.log("request", path, method, data);
        const response = await axios({
            url: path,
            method: method,
            data: data
        });
        return response.data;
    } catch (err) {
        console.error(err);
    }
}