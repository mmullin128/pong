import dotenv from 'dotenv';
import path from 'path';
//import { dirname, path } from 'path';
import { fileURLToPath } from 'url';

import { startServer, closeServer } from "../../src/server";

describe("server functions", () => {
    beforeAll(() => {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        dotenv.config({ path: path.join(__dirname, '../../.env')});
    });
    test("sever startup and shutdown", async () => {
        const PORT = process.env.PORT;
        const URI = process.env.URI;
        const server = await startServer(PORT, URI);
        expect(server.status).toBe('running');
        const endStatus = await closeServer(server);
        expect(endStatus).toBe('closed');
    })
})