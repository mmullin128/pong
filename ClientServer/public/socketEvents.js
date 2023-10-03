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


export const addPlayerData = async (socket, id, coll, playerData) => {
    await socket.sendMessage("addPlayerData",{ id: id, coll: coll, playerData: playerData});
    return true;
}
export const checkPrivateGame = async (socket, id, gameID) => {
    await socket.sendMessage("checkPrivateGame",{ id: id, gameID: gameID});
    return true;
}
export const checkStatus = async (socket, id, coll) => {
    await socket.sendMessage("checkStatus",{ id: id, coll: coll });
    return true;
}
export const checkUsername = async (socket, id, coll, username) => {
    await socket.sendMessage("checkUsername",{ id: id, coll: coll, username: username });
    return true;
}
export const chooseTeam = async (socket, id, gameID, team) => {
    await socket.sendMessage("chooseTeam",{ id: id, gameID: gameID, team: team });
    return true;
}
export const readyUp = async (socket, id, coll) => {
    await socket.sendMessage("readyUp",{ id: id, coll: coll });
    return true;
}
export const setUsername = async (socket, id, coll, username) => {
    await socket.sendMessage("setUsername",{ id: id, coll: coll, username: username });
    return true;
}





