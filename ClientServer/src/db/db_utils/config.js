//configures the database to structure set in structure.json
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import jsonFromFile from '../../../utils/jsonFromFile.js';

import { mongoClient, connect, disconnect } from '../../../src/db/mongoClient.js';


//config should only be run on first server startup;
export async function config(client) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const structure = await jsonFromFile(path.join(__dirname, './structure.json'));
    const metaCollection = client.db("DB1").collection("Meta");
    await metaCollection.deleteMany({});
    await metaCollection.insertOne(
        structure["Meta"]
    );
    console.log('db configured');
}

export async function run() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    dotenv.config({ path: path.join(__dirname, '../../../.env')});
    const DB_URI = process.env.DB_URI;
    console.log("Running db config: ", DB_URI.split(":")[0],"...")
    const client = mongoClient(DB_URI);
    await connect(client);
    await config(client);
    await disconnect(client);
}

process.argv.forEach(async (val,index,arr) => {
    if (val == "run") {
        await run();
        process.exit(1);
    }
})