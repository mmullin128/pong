import { MongoClient } from 'mongodb';
import jsonFromFile from '../../utils/jsonFromFile.js';

import path from 'path';
import { fileURLToPath } from 'url';

export function mongoClient(DB_URI) {
    return new MongoClient(DB_URI);
}

export async function appStructure() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const structure = await jsonFromFile(path.join(__dirname, './structure.json'));
    return structure();
}

export const connect = (dbClient) => new Promise((resolve,reject) => {
    dbClient.connect()
    .catch((err) => reject(err))
    .then(() => {
        resolve("connected")
    });
});

export const disconnect = (dbClient) => new Promise((resolve,reject) => {
    dbClient.close()
    .catch((err) => reject(err))
    .then(() => {
        resolve("disconnected")
    });
});