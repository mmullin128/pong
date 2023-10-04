export const Socket = (url,events) => { return new Promise((resolve,reject) => {
    const timeOut = setTimeout(() => {
        reject(`timeout`);
    },5000);
    const socket = new WebSocket(url);
    socket.sendMessage = (messageName,messageBody) => {
        socket.send(JSON.stringify({name: messageName, body: messageBody}));
    }
    socket.addEventListener("message", async event => {
        const message =  await JSON.parse(event.data);
        console.log(message);
        //console.log(events);
        for (let event of events) {
            if (event.name == message.name) {
                event.handler(socket,message.body);;
                return;
            }
        }
        console.log("no handler", "name: ", message.name, "body: ", message.body);
    })
    socket.addEventListener("open", event => {
        clearTimeout(timeOut);
        resolve(socket);
    })

})}


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
export const connect = async (socket, id, coll) => {
    await socket.sendMessage("connect",{ id: id, coll: coll });
    return true;
}
export const readyUp = async (socket, id, coll, value) => {
    await socket.sendMessage("readyUp",{ id: id, coll: coll, value: value });
    return true;
}
export const setUsername = async (socket, id, coll, username) => {
    await socket.sendMessage("setUsername",{ id: id, coll: coll, username: username });
    return true;
}





