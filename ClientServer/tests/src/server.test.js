import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { startServer, closeServer } from "../../src/server";

describe("server functions", () => {
    beforeAll(() => {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        dotenv.config({ path: path.join(__dirname, '../../.env')});
        
    });
    test("sever startup and shutdown", async () => {
        const PORT = process.env.PORT;
        const DB_URI = process.env.DB_URI;
        console.log(": ", DB_URI.split(":")[0],"..."); //if working should be 'mongodb+srv'
        const server = await startServer(PORT, DB_URI);
        expect(server.status).toBe('running');
        const endStatus = await closeServer(server);
        expect(endStatus).toBe('closed');
    })
})