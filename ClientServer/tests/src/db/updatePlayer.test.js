import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { mongoClient, connect, disconnect } from '../../../src/db/mongoClient.js';

import { getCollectionMeta } from '../../../src/db/getCollectionMeta.js';
import { updatePlayer } from '../../../src/db/updatePlayer.js';
import { addPlayer } from '../../../src/db/addPlayer.js';
import { removePlayer } from '../../../src/db/removePlayer.js';


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
        const n = 1;
        const playerData = {
            length: 1
        }
        try {        
            for (let i=0; i<n; i++) {
                const player = await addPlayer(client,1);
                //console.log(`${i}: `, player.id , player.collectionCode);
                players.push(player);
            }
            for (let i=0; i<n; i++) {
                const collectionData = await getCollectionMeta(client,'Players',0,players[i].collectionCode);
                console.log(`${i}`,'update', collectionData.name);
                await updatePlayer(client,collectionData.collectionCode,players[i].id,playerData);
                //await removePlayer(client,collectionData.name,players[i].id);
            }
            await disconnect(client);
        } catch (err) {
            await disconnect(client);
            throw (err);
        }
    })
})