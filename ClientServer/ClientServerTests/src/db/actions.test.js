import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { mongoClient, connect, disconnect } from '../../../src/db/mongoClient.js';
import { insert } from '../../../src/db/insert.js';
import { update } from '../../../src/db/update.js';
import { get } from '../../../src/db/get.js';
import { remove } from '../../../src/db/remove.js';
import { addPlayer } from '../../../src/db/addPlayer.js';
import { getMeta } from '../../../src/db/metaActions.js';


describe("Database Actions", () => {
    beforeAll(() => {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        dotenv.config({ path: path.join(__dirname, '../../../.env')});
        
    });
    test("actions", async () => {
        const DB_URI = process.env.DB_URI;
        const client = mongoClient(DB_URI);
        try {
            const startStatus = await connect(client);
            //insert game
            const gameResponse = await insert(client,"Game");
            expect(gameResponse.id).toBeTruthy();
            //insert player
            const playerResponse = await insert(client,"Player");
            expect(playerResponse.id).toBeTruthy();
            console.log("inserted player");
            //update player
            const updateResponse = await update(client,"Player",playerResponse.id,playerResponse.collectionCode,{"test": true});
            expect(updateResponse).toBeTruthy();
            console.log("updated player");
            //get player
            let getResponse = await get(client,"Player",playerResponse.id,playerResponse.collectionCode);
            expect(getResponse).toBeTruthy();
            //get game
            getResponse = await get(client,"Game",gameResponse.id,gameResponse.collectionCode);
            expect(getResponse).toBeTruthy();
            //get servers
            getResponse = await getMeta(client,"Servers");
            expect(getResponse.length > 0);
            //addplayer
            const addResponse = await addPlayer(client,gameResponse.id,gameResponse.collectionCode,playerResponse.id,playerResponse.collectionCode);
            expect(addResponse).toBeTruthy();
            
            //remove player
            const pRemove = await remove(client,"Player",playerResponse.id,playerResponse.collectionCode);
            expect(pRemove).toBeTruthy();

            //remove game
            const gRemove = await remove(client,"Game",gameResponse.id,gameResponse.collectionCode);
            expect(gRemove).toBeTruthy();

            const endStatus = await disconnect(client);
        } catch (err) {
            console.error(err);
            await disconnect(client);
        }
    }, 6000)
})