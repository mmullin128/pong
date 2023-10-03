import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { startServer, closeServer } from '../../../src/server';

import { createRequest } from '../../public/request'; //test request function using axios
import { reserveSpot } from '../../../public/reserveSpot';

import { Socket } from '../../public/socket';
import { addPlayerData } from '../../../public/socketEvents';

describe("server functions", () => {
    beforeAll(() => {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        //dotenv only configures env variables from .env on a locally run environment containing a .env file
        //instances run from devolopment and deployment servers must pass in env variables
        dotenv.config({ path: path.join(__dirname, '../../../.env')});
        
    });
    test("events", async () => {
        let messages = [];
        const addMessage = (name,body) => {
            messages.push({ name: name, body: body });
        }
        const lookForMessage = (message) => new Promise((resolve, reject) => {
            const search = setInterval(() => {
                for (let received of messages) {
                    if (received.name == message) {
                        clearTimeout(timeOut);
                        resolve(received);
                        clearInterval(search);
                    }
                }
            }, .3);
            const timeOut = setTimeout(() => {
                clearInterval(search);
                reject(new Error("timeout"))
            }, 1000);
        })
        const events = [
            {
                "name": "error",
                "handler": (socket,body) => {
                    addMessage("error",body);
                    socket.close();
                }
            },
            {
                "name": "success",
                "handler": (socket,body) => {
                    addMessage("success",body);
                }
            }
        ]
        const checkMessages = (name) => new Promise((resolve,reject) => {
            for (let message of messages) {
                if (message.name == name) {
                    resolve(message);
                }
            }
        })
        const PORT = parseInt(process.env.PORT,10) + 2;
        const req = await createRequest(PORT);
        const DB_URI = process.env.DB_URI;
        //console.log(": ", DB_URI.split(":")[0],"..."); //if working should be 'mongodb+srv'
        //start server
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        process.chdir(path.join(__dirname, '../../../src'));
        const server = await startServer(PORT, DB_URI);
        const baseURL = `http://localhost:${PORT}`;
        const socketURL = `ws://localhost:${PORT}`;
        try {
            //reserve spot
            const reserveResponse = await reserveSpot(req);
            //console.log(reserveResponse);
            const { id, coll } = reserveResponse;
            //connect to socket
            const socket = await Socket(socketURL,events);
            expect(socket).toBeTruthy();

            try {
                //addplayerdata
                const playerData = { length: 1, speed: 1, turnSpeed: 1};
                addPlayerData(socket,id,coll,playerData);
                try {
                    const errorMessage = await lookForMessage("error");
                    console.log(errorMessage);
                } catch (error) {
                    expect(error.message).toBe("timeout");
                }
                const message = await lookForMessage("success");
                expect(message.name).toBe("success");
                //
            } catch (err) {
                console.log(err);
            } finally {
                socket.close();
            }
        } catch(err) {
            console.error(err);
        } finally {
            const endStatus = await closeServer(server);
        }
        
    }, 7000)
})