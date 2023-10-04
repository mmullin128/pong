import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';

import { homePage } from './routes/homePage.js';
import { joinPage } from './routes/joinPage.js';
import { joinWithCode } from './routes/joinWithCode.js';
import { getServers } from './routes/getServers.js';
import { findMatch } from './routes/findMatch.js';
import { errorPage } from './routes/errorPage.js';
import { reserveSpot } from './routes/reserveSpot.js';

import { addPlayerData } from './events/addPlayerData.js';
import { checkPrivateGame } from './events/checkPrivateGame.js';
import { checkStatus } from './events/checkStatus.js';
import { checkUsername } from './events/checkUsername.js';
import { chooseTeam } from './events/chooseTeam.js';
import { connect } from './events/connect.js';
import { readyUp } from './events/readyUp.js';
import { setUsername } from './events/setUsername.js';

import { connect as connectDB, disconnect as disconnectDB, mongoClient } from './db/mongoClient.js';
import { createPrivateGame } from './routes/createPrivateGame.js';

export const startServer = (port,databaseURI) => new Promise((resolve,reject) => {
    try {
        const dbClient = mongoClient(databaseURI);
        const app = express();
        app.use(bodyParser.json({limit: "30mb", extended: "true"}));
        app.use(bodyParser.urlencoded({limit: "30mb", extended: "true"}));
        app.use(express.static("../public"));
        app.set('view engine', 'pug');
        app.use(cors({origin: "*"}));

        //CLient URLS
        //request homepage
        app.get('/', (req,res) => homePage(req,res));
        //join game with link
        app.get('/pv/:gameID(\\w{4})/', (req,res) => joinPage(dbClient,req,res)) //4 character gameID encoded into url
        //err
        app.get('/err', errorPage);
        //API calls
        //join game with gameID [JSON]
        app.get('/joinPrivateGame', (req,res) => joinWithCode(dbClient,req,res));
        app.get('/reserveSpot', (req,res) => reserveSpot(dbClient,req,res));
        //join game with gameID [JSON]
        app.get('/createPrivateGame', (req,res) => createPrivateGame(dbClient,req,res));
        //get list of gameServer urls
        app.get('/getServers',(req,res) => getServers(dbClient,req,res));
        //update player to be available for match making
        app.post('/findMatch',(req,res) => findMatch(dbClient,req,res));
        
        const server = http.createServer(app);
        server.status = 'idle';
        server.dbClient = dbClient;
        const socketServer = new WebSocketServer({ server: server});
        socketServer.on("connection", socket => {
            socket.on("message", async data => {
                const message = await JSON.parse(data);
                let response;
                switch (message.name) {
                    case "addPlayerData":
                        response = await addPlayerData(dbClient,message.body);
                        break;
                    case "checkPrivateGame":
                        response = await checkPrivateGame(dbClient,message.body);
                        break;
                    case "checkStatus":
                        response = await checkStatus(dbClient,message.body);
                        break;
                    case "checkUsername":
                        response = await checkUsername(dbClient,message.body);
                        break;
                    case "chooseTeam":
                        response = await chooseTeam(dbClient,message.body);
                        break;
                    case "connect":
                        response = await connect(dbClient,message.body);
                        break;
                    //case "disconnect":
                    //    response = await disconnect(dbClient,message.body);
                    //    break;
                    case "readyUp":
                        response = await readyUp(dbClient,message.body);
                        break;
                    //case "reconnect":
                    //    response = await reconnect(dbClient,message.body);
                    //    break;
                    case "reserverSpot":
                        response = await reserveSpot(dbClient,message.body);
                        break;
                    case "setUsername":
                        response = await setUsername(dbClient,message.body);
                        break;
                    default:
                        response = {
                            name: "error",
                            body: {
                                "error": "invalid socket event",
                                request: {
                                    "name": message.name,
                                    "body": message.body,
                                }
                            }
                        }
                }
                socket.send(JSON.stringify(response));
            })
        })
        try {
            server.listen(port, async () => {
                await connectDB(server.dbClient);
                console.log('listening on port: ', port);
                server.status = 'running';
                resolve(server);
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
        server.close( async ()=> {
            const message = await disconnectDB(server.dbClient);
            server.status = 'closed';
            resolve(server.status);
        })
    } catch (err) {
        reject(err);
    }
})