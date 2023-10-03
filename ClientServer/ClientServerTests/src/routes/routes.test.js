import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { startServer, closeServer } from '../../../src/server';

import { createRequest } from '../../public/request'; //test request function using axios

import { createPrivateGame } from '../../../public/createPrivateGame';
import { joinWithCode } from '../../../public/joinWithCode';
import { reserveSpot } from '../../../public/reserveSpot';
import { getServers } from '../../../public/getServers';
import { findMatch } from '../../../public/findMatch';

import { WebSocket } from 'ws';

describe("server functions", () => {
    beforeAll(() => {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        //dotenv only configures env variables from .env on a locally run environment containing a .env file
        //instances run from devolopment and deployment servers must pass in env variables
        dotenv.config({ path: path.join(__dirname, '../../../.env')});
        
    });
    test("routes", async () => {
        const PORT = parseInt(process.env.PORT,10) + 1;
        const req = await createRequest(PORT);
        const DB_URI = process.env.DB_URI;
        //console.log(": ", DB_URI.split(":")[0],"..."); //if working should be 'mongodb+srv'
        //start server
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        process.chdir(path.join(__dirname, '../../../src'));
        const server = await startServer(PORT, DB_URI);
        const baseURL = `http://localhost:${PORT}`
        try {
            //homepage
            const html = await axios.get(baseURL);
            expect(html).toBeTruthy();

            //get servers
            const serversResponse = await getServers(req);
            expect(serversResponse.servers.length > 0);
            //console.log(serversResponse.servers);


            //create private game
            const createResponse = await createPrivateGame( { "max": 3 } , req);
            const { id, coll, link} = createResponse;
            expect(id).toBeTruthy();
            expect(coll).toBeTruthy();
            expect(link).toBeTruthy();

            //reserve spot
            const reserveResponse = await reserveSpot(req);
            expect(reserveResponse.id).toBeTruthy();
            expect(reserveResponse.coll).toBeTruthy();

            //join with link
            const gameURL = baseURL + `${link}`
            const joinHTML = await axios.get(gameURL);
            expect(joinHTML).toBeTruthy()

            //join with code
            const joinResponse = await joinWithCode(id,reserveResponse.id,reserveResponse.coll,req);
            expect(joinResponse).toBeTruthy();
            for (let i=0;i<4;i++) {
                const pResponse = await reserveSpot(req);
                //console.log('tite ',pResponse, id);
                const pJoinResponse = await joinWithCode(id,pResponse.id,pResponse.coll,req);
                expect(pJoinResponse).toBeTruthy();
            }

            //find match
            for (let i=0;i<1;i++) {
                const pResponse = await reserveSpot(req);
                const pJoinResponse = await findMatch(pResponse.id,pResponse.coll,req);
                expect(pJoinResponse).toBeTruthy();
            }
        } catch(err) {
            console.error(err);
        } finally {
            const endStatus = await closeServer(server);
        }
        
    }, 5000)
})