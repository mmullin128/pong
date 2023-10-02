import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

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
        const server = await startServer(PORT, DB_URI);
        expect(server.status).toBe('running');
        try {
            console.log(`http://localhost:${PORT}/`)
            const response = await axios.get(`http://localhost:${PORT}/`);
            expect(response).toBeTruthy();
        } catch(err) {
            console.error(err);
        }
        const endStatus = await closeServer(server);
        expect(endStatus).toBe('closed');
    }, 5000)
})