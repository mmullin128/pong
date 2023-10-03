import { WebSocket } from "ws";
import { SocketTimeOutError } from "../../src/errors/errors";
export const Socket = (url,events) => { return new Promise((resolve,reject) => {
    //console.log(url);
    const timeOutObj = setTimeout(() => {
        //console.log('timeout');
        reject(new Error("timeout"));
    },2000);
    try {
        const socket = new WebSocket(url);
        socket.on('error', err => {
            //catches errors on the socket such as connection refused

        });
        socket.on("message", async data => {
            const message = await JSON.parse(data);
            const { name, body } = message;
            for (let i=0; i<events.length; i++) {
                if (name == events[i].name) {
                    events[i].handler(socket,body);
                    return;
                }
            }
            console.log("no handler", name, body);
        })
        socket.sendMessage = async (messageName,messageBody) => {
            socket.send(JSON.stringify({ name: messageName, body: messageBody }), (err) => {
                if (err) throw err;
                return 1;
            });
        }
        socket.on("open", () => {
            //console.log(timeOutID);
            //resolve promise once connection established
            clearTimeout(timeOutObj);
            resolve(socket);
        })
    } catch (err) {
        //will catch errors from Websocket such as SyntaxError for bad url
        clearTimeout(timeOutObj);
        reject(err);
    }
})}

export const events = [];

export let messages = [];