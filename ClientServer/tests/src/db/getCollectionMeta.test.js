import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import jsonFromFile from '../../../utils/jsonFromFile.js';
import { mongoClient, connect, disconnect } from '../../../src/db/mongoClient.js';
import { getMeta } from '../../../src/db/metaActions.js';
describe("Get Collection Meta", () => {
    beforeAll(() => {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        dotenv.config({ path: path.join(__dirname, '../../../.env')});
        
    });
    test("getCollectionMeta", async () => {
        const DB_URI = process.env.DB_URI;
        const client = mongoClient(DB_URI);
        await connect(client);
        try {        
            const __dirname = path.dirname(fileURLToPath(import.meta.url));
            const structure = await jsonFromFile(path.join(__dirname, '../../../src/db/db_utils/structure.json'));
            const playersCollections = structure["Meta"]["playersCollections"];
            const gamesCollections = structure["Meta"]["gamesCollections"];
            const gameServers = structure["Meta"]["gameServers"];
            let collectionName;
            for (let i=0; i<playersCollections.length; i++) {
                collectionName=playersCollections[i].name;
                let n = i+1
                const data = await getMeta(client,"Players" + n);
                expect(data.name).toBe(collectionName)
            }
            for (let i=0; i<gamesCollections.length; i++) {
                collectionName=gamesCollections[i].name;
                let n = i+1
                const data = await getMeta(client,"Games" + n);
                expect(data.name).toBe(collectionName)
            }
            for (let i=0; i<gameServers.length; i++) {
                collectionName=gameServers[i].name;
                let n = i+1
                const data = await getMeta(client,"S" + n);
                expect(data.name).toBe(collectionName)
            }
            await disconnect(client);
        } catch (err) {
            await disconnect(client);
            throw (err);
        }
    })
})