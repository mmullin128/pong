import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { mongoClient, connect, disconnect } from '../../../src/db/mongoClient.js';

import { insert } from '../../../src/db/insert.js';
import { update } from '../../../src/db/update.js';
import { remove } from '../../../src/db/remove.js';
describe("Update Players", () => {
    beforeAll(() => {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        dotenv.config({ path: path.join(__dirname, '../../../.env')});
    });
    test("updatePlayer", async () => {
        const DB_URI = process.env.DB_URI;
        const client = mongoClient(DB_URI);
        await connect(client);
        const players = [];
        const n = 10;
        const playerData = {
            length: 1
        }
        try {        
            for (let i=0; i<n; i++) {
                const player = await insert(client,"Player");
                //console.log(`${i}: `, player.id , player.collectionCode);
                players.push(player);
            }
            for (let i=0; i<n; i++) {
                await update(client,"P",players[i].id,"playerData",playerData,players[i].collectionCode);
                //await removePlayer(client,collectionData.name,players[i].id);
            }
            await disconnect(client);
        } catch (err) {
            await disconnect(client);
            throw (err);
        }
    })
})