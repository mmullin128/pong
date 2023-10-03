import axios from "axios";
export const request = async (path,port,method,data) => { 
    try {
        const baseURL = `http://localhost:${port}`;
        path = baseURL + path;
        //console.log("request", path, method, data);
        const response = await axios({
            url: path,
            method: method,
            data: data
        });
        //console.log(response.data);
        return response.data;
    } catch (err) {
        console.error(err);
    }
}

export const createRequest = async (port) => {
    const request = async (path,method,data) => {
        const baseURL = `http://localhost:${port}`;
        path = baseURL + path;
        //console.log("request", path, method, data);
        const response = await axios({
            url: path,
            method: method,
            data: data
        });
        //console.log(response.data);
        return response.data;
    }
    return request;
}