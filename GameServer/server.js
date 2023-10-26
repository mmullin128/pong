import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';

import events from './events.js';

export class Server {
    constructor(port,adminID) {
        this.port = port;
        this.adminID = adminID;
        this.app = express();
        this.app.use(bodyParser.json({limit: "30mb", extended: "true"}));
        this.app.use(bodyParser.urlencoded({limit: "30mb", extended: "true"}));
        this.app.use(cors({origin: "*"}));
        this.dbClient = mongoClient
        this.server = http.createServer(app);
        this.socketServer = new WebSocketServer({ server: server});
        this.status = 'idle';
        this.socketServer.on("connection", socket => {
            socket.on("message", async data => {
                const message = await JSON.parse(data);
                let response = {
                    name: "error",
                    body: {
                        error: "invalid socket event",
                        request: {
                            "name": message.name,
                            "body": message.body,
                        }
                    }
                };
                if (message.name in events) {
                    response = events[message.name](message.body,this.adminID);
                }
                socket.send(JSON.stringify(response));
            });
        })
    }
}


export const startServer = (server) => new Promise( async (resolve,reject) => {
    try {
        try {
            server.server.listen(server.port, async () => {
                //await connectDB(server.dbClient);
                console.log('listening on port: ', port);
                server.status = 'running';
                resolve(server.status);
            })
        } catch (err) {
            closeServer(server)
            .catch(() => {})
            .then(() => reject(err));
        }
    } catch (err) {
        reject(err);
    }
})

export const closeServer = (server) => new Promise((resolve,reject) => {
    try {
        if (server.status == 'closed') resolve(server.status);
        server.server.close( async ()=> {
            //const message = await disconnectDB(server.dbClient);
            server.status = 'closed';
            resolve(server.status);
        })
    } catch (err) {
        reject(err);
    }
})
