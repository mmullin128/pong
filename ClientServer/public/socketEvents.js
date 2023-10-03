import { rejects } from "assert";
import { resolve } from "path";

export const Socket = (url) => { return new Promise((resolve,reject) => {
    const timeOut = setTimeout(() => {
        reject(`timeout: ${url}`);
    },5000);
    const socket = new WebSocket(url);
    socket.addEventListener("message", async data => {
        const { name, body } = await JSON.parse(data);
        switch (name) {
            case "success":
                successMessage(body);
            default:
                console.log("message", name, body);
        }
    })
    socket.addEventListener("open", event => {
        resolve(socket);
    })

})}

export async function successMessage(messageBody) {
    return {"name": "success", "body": messageBody};
}

export const send = (socket,name,body) => { return new Promise((resolve,reject) => {
    try {
        const jsonString = JSON.stringify({name: name, body: body});
        socket.send(jsonString);
        resolve(true);
    } catch (err) {
        reject(err);
    }
})}
export const addPlayerData = (socket, id, coll, playerData) => {
    socket.sendMessage("addPlayerData",{ id: id, coll: coll, playerData: playerData});
    return true;
}

export const checkUsername = (socket,username) => { return new Promise((resolve,reject) => {
    try {
        socket.send(JSON.stringify({name: "checkUsername", body: username}));
        resolve();
    } catch(err) {
        reject(err);
    }
})}

export const checkStatus = (socket,username) => { return new Promise((resolve,reject) => {
    try {
        socket.send(JSON.stringify({name: "checkUsername", body: username}));
        resolve();
    } catch(err) {
        reject(err);
    }
})}