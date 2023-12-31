import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { mongoClient, connect, disconnect } from '../../../../ClientServer/src/db/mongoClient.js';

describe("Mongo Client Setup", () => {
    beforeAll(() => {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        dotenv.config({ path: path.join(__dirname, '../../.env')});
        
    });
    test("startup, connect, disconnect", async () => {
        const DB_URI = process.env.DB_URI;
        const client = mongoClient(DB_URI);
        try {
            const startStatus = await connect(client);
            expect(startStatus).toBe('connected');
            const endStatus = await disconnect(client);
            expect(endStatus).toBe('disconnected');
        } catch (err) {
            console.error(err);
            await disconnect(client);
        }
    }, 6000)
})