import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { startServer, closeServer } from '../../../src/server';

import { createRequest } from '../../public/request'; //test request function using axios
import { reserveSpot } from '../../../public/reserveSpot';
import { createPrivateGame } from '../../../public/createPrivateGame';
import { joinWithCode } from '../../../public/joinWithCode';

import { Socket } from '../../public/socket';
import { addPlayerData,
    checkPrivateGame,
    checkStatus,
    checkUsername,
    chooseTeam,
    readyUp,
    setUsername
 } from '../../../public/socketEvents';
import { generateID } from '../../../utils/idGenerators';




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
        const lookForMessage = (name,ms) => new Promise((resolve, reject) => {
            const search = setInterval(() => {
                for (let received of messages) {
                    if (received.name == name) {
                        clearTimeout(timeOut);
                        clearInterval(search);
                        resolve(received);
                    }
                }
            }, 50);
            const timeOut = setTimeout(() => {
                clearInterval(search);
                resolve("timeout")
            }, ms);
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
            },
            
            {
                "name": "checkUsername",
                "handler": (socket,body) => {
                    addMessage("checkUsername",body);
                }
            }
        ];
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
            const p1Name = generateID(5);
            const p2Name = generateID(5);
            const p3Name = generateID(5);
            const reserveResponse = await reserveSpot(req);
            const { id, coll } = reserveResponse;
            const createResponse = await createPrivateGame({ "max": 3 }, req);
            const gameID = createResponse.id;
            const joinResponse = await joinWithCode(gameID,id,coll,req);
            //connect to socket
            const socket = await Socket(socketURL,events);
            expect(socket).toBeTruthy();

            try {
                //addplayerdata
                const playerData = { length: 1, speed: 1, turnSpeed: 1};
                await addPlayerData(socket,id,coll,playerData);
                let message = await lookForMessage("success",1000);
                expect(message).not.toBe("timeout");           
                expect(message.name).toBe("success");

                messages = [];

                //check private game
                await checkPrivateGame(socket,id,gameID);
                message = await lookForMessage("success",1000);
                if (message == "timeout") {
                    let errorMessage = await lookForMessage("error",1000);
                    console.log(errorMessage);
                }
                expect(message).not.toBe("timeout");           
                expect(message.name).toBe("success");

                messages = [];
                
                //check status
                await checkStatus(socket,id,coll);
                message = await lookForMessage("success",1000);
                expect(message).not.toBe("timeout");           
                expect(message.name).toBe("success");

                messages = [];

                //checkUsername
                await checkUsername(socket,id,coll,p1Name)
                message = await lookForMessage("checkUsername",1000);
                expect(message).not.toBe("timeout");    
                expect(message.body["taken"]).toBe(false);

                messages = [];
                
                //chooseTeam
                await chooseTeam(socket,id,gameID,"A");
                message = await lookForMessage("success",1000);
                expect(message).not.toBe("timeout");           
                expect(message.name).toBe("success");

                messages = [];
                
                //readyUp
                await readyUp(socket,id,coll,1); 
                message = await lookForMessage("success",1000);
                expect(message).not.toBe("timeout");


                messages = [];
                
                //setUsername -- private
                await setUsername(socket,id,coll,p1Name);
                message = await lookForMessage("success",1000);
                expect(message).not.toBe("timeout");


                messages = [];
                
                //setUsername -- public
                let p2ReserveResponse = await reserveSpot(req);
                await setUsername(socket,p2ReserveResponse.id,p2ReserveResponse.coll,p2Name);
                message = await lookForMessage("success",1000);
                expect(message).not.toBe("timeout");
                
                messages = [];

                //setUsernameFail -- public
                p2ReserveResponse = await reserveSpot(req);
                await setUsername(socket,p2ReserveResponse.id,p2ReserveResponse.coll,p2Name);
                message = await lookForMessage("checkUsername",1000);
                expect(message).not.toBe("timeout");
                expect(message.body.taken).toBe(true);


            } catch (err) {
                console.log(err);
                //throw err;
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