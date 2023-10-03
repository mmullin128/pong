import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { Socket } from '../public/socket.js';

import { startServer, closeServer } from "../../src/server.js";

describe("server functions", () => {
    beforeAll(() => {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        //dotenv only configures env variables from .env on a locally run environment containing a .env file
        //instances run from devolopment and deployment servers must pass in env variables
        dotenv.config({ path: path.join(__dirname, '../../.env')});
        
    });
    test("sever startup and shutdown", async () => {
        const PORT = process.env.PORT;
        const DB_URI = process.env.DB_URI;
        //console.log(": ", DB_URI.split(":")[0],"..."); //if working should be 'mongodb+srv'
        
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        process.chdir(path.join(__dirname, '../../src/'));
        const url = `http://localhost:${PORT}/`;
        const socketURL = `ws://localhost:${PORT}`;
        const badUrl = `ws://localhost:${PORT}E`;
        try {
            //start server
            const server = await startServer(PORT, DB_URI); 
            try {    
                expect(server.status).toBe('running');
                //get homepage
                const response = await axios.get(url);
                expect(response).toBeTruthy();
                //connect socket
                const socket = await Socket(socketURL);
                expect(socket.OPEN).toBe(1);
                await socket.close();
                expect(socket.CLOSED).toBe(3);
                try {
                    const socketFail = await Socket(badUrl);
                } catch (err) {
                    expect(err.name).toBe("SyntaxError");
                }
                const endStatus = await closeServer(server);
                expect(endStatus).toBe("closed")
                try {
                    const socketFail = await Socket(socketURL);
                } catch (err) {
                    expect(err.message).toBe("timeout");
                }
            } catch (err) {
                await closeServer(server);
                throw err;
            }
        } catch(err) {
            console.error(err);
            
        }
    }, 10000)
})