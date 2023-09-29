import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { mongoClient, connect, disconnect } from '../../../src/db/mongoClient.js';

import { insert } from '../../../src/db/insert.js';
import { remove } from '../../../src/db/remove.js';
describe("Add and Remove Players", () => {
    beforeAll(() => {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        dotenv.config({ path: path.join(__dirname, '../../../.env')});
    });
    test("addPlayer", async () => {
        const DB_URI = process.env.DB_URI;
        const client = mongoClient(DB_URI);
        await connect(client);
        const players = [];
        const n = 6;
        try {        
            for (let i=0; i<n; i++) {
                const player = await insert(client,"Player");
                //console.log(`${i}: `, player.id , player.collectionCode);
                players.push(player);
            }
            for (let i=0; i<n; i++) {
                await remove(client,"P",players[i].id,players[i].collectionCode);
            }
            await disconnect(client);
        } catch (err) {
            await disconnect(client);
            throw (err);
        }
    })
})