import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { startServer, closeServer } from '../../../src/server';

import { request } from '../../public/request'; //test request function using axios

import { createPrivateGame } from '../../../public/createPrivateGame';
import { joinWithCode } from '../../../public/joinWithCode';
import { reserveSpot } from '../../../public/reserveSpot';

import { WebSocket } from 'ws';

describe("server functions", () => {
    beforeAll(() => {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        //dotenv only configures env variables from .env on a locally run environment containing a .env file
        //instances run from devolopment and deployment servers must pass in env variables
        dotenv.config({ path: path.join(__dirname, '../../../.env')});
        
    });
    test("routes", async () => {
        const PORT = process.env.PORT + 1;
        const DB_URI = process.env.DB_URI;
        //console.log(": ", DB_URI.split(":")[0],"..."); //if working should be 'mongodb+srv'
        //start server
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        process.chdir(path.join(__dirname, '../../../src'));
        const server = await startServer(PORT, DB_URI);
        const baseURL = `http://localhost:${PORT}`
        try {
            //console.log(`http://localhost:${PORT}/`)
            //homepage
            console.log(baseURL);
            const html = await axios.get(baseURL);
            expect(html).toBeTruthy();
            console.log('got home page');
            //create private game
            const createResponse = await createPrivateGame({ "gameSettings": { "max": 3 } }, request);
            const { id, coll, link} = createResponse;
            expect(id).toBeTruthy();
            expect(coll).toBeTruthy();
            expect(link).toBeTruthy();
            //reserve spot
            const reserveResponse = await reserveSpot(request);
            expect(reserveResponse.id).toBeTruthy();
            expect(reserveResponse.coll).toBeTruthy();
            //join with link
            const gameURL = baseURL + `${link}`
            const joinHTML = await axios.get(gameURL);
            expect(joinHTML).toBeTruthy()
            //join with code
            const joinResponse = await joinWithCode(id,reserveResponse.id,reserveResponse.coll,request);
            expect(joinResponse).toBeTruthy();
            for (let i=0;i<4;i++) {
                const pResponse = await reserveSpot(request);
                const pJoinResponse = await joinWithCode(id,pResponse.id,pResponse.coll,request);
            }

        } catch(err) {
            console.error(err);
        } finally {
            const endStatus = await closeServer(server);
        }
        
    }, 5000)
})