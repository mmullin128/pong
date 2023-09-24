import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';

import { homePage } from './routes/homePage.js';
import { joinWithLink } from './routes/joinWithLink.js';
import { joinWithCode } from './routes/joinWithCode.js';
import { getServers } from './routes/getServers.js';
import { findMatch } from './routes/findMatch.js';
import { errorPage } from './routes/errorPage.js';

import { addPlayerData } from './events/addPlayerData.js';
import { checkPrivateGame } from './events/checkPrivateGame.js';
import { checkStatus } from './events/checkStatus.js';
import { checkUsername } from './events/checkUsername.js';
import { chooseTeam } from './events/chooseTeam.js';
import { disconnect } from './events/disconnect.js';
import { readyUp } from './events/readyUp.js';
import { reconnect } from './events/reconnect.js';
import { reserveSpot } from './events/reserveSpot.js';

export const startServer = (port,databaseURI) => new Promise( async (resolve,reject) => {
    try {
        const app = express();
        app.use(bodyParser.json({limit: "30mb", extended: "true"}));
        app.use(bodyParser.urlencoded({limit: "30mb", extended: "true"}));
        app.use(express.static("../public"));
        app.set('view engine', 'pug');
        app.use(cors({origin: "*"}));

        //CLient URLS
        //request homepage
        app.get('/', homePage);
        //join game with link
        app.get('/pv/:gameID(\\w{4})', joinWithLink) //4 character gameID encoded into url
        
        //API calls
        //join game with gameID [JSON]
        app.get('/joinPrivateGame', joinWithCode);
        //get list of gameServer urls
        app.get('/getServers',getServers);
        //update player to be available for match making
        app.post('/findMatch',findMatch);
        
        const server = http.createServer(app);
        server.status = 'idle';
        const socketServer = new WebSocketServer({ server: server});
        socketServer.on("connection", socket => {

            socket.on("message", async message => {
                let response;
                switch (message.name) {
                    case "addPlayerData":
                        response = await addPlayerData(message.body);
                        break;
                    case "checkPrivateGame":
                        response = await checkPrivateGame(message.body);
                        break;
                    case "checkStatus":
                        response = await checkStatus(message.body);
                        break;
                    case "checkUsername":
                        response = await checkUsername(message.body);
                        break;
                    case "chooseTeam":
                        response = await chooseTeam(message.body);
                        break;
                    case "disconnect":
                        response = await disconnect(message.body);
                        break;
                    case "readyUp":
                        response = await readyUp(message.body);
                        break;
                    case "reconnect":
                        response = await reconnect(message.body);
                        break;
                    case "reserverSpot":
                        response = await reserveSpot(message.body);
                        break;
                    default:
                        response = {
                            message: "error",
                            body: {
                                error: "invalid socket event"
                            }
                        }
                }
                socket.send(JSON.stringify(response));
            })
        })
        try {
            server.listen(port, () => {
                console.log('server listening on port: ' + port);
                server.status = 'running';
                resolve(server);
            })
        } catch (err) {
            console.log('server startup failed');
            closeServer(server)
            .catch(() => {})
            .then(() => reject(err));
        }
    } catch (err) {
        console.log('server setup failed');
        reject(err);
    }
})

export const closeServer = (server) => new Promise((resolve,reject) => {
    try {
        server.close(()=> {
            console.log('server closed');
            resolve('closed');
        })
    } catch (err) {
        reject(err);
    }
})