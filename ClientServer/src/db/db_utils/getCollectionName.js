import path from 'path';
import { fileURLToPath } from 'url';
import jsonFromFile from '../../../utils/jsonFromFile.js';
import { getCollectionMeta } from '../getCollectionMeta.js';
import { mongoClient } from '../mongoClient.js';

export async function getCollectionName(mongoClient,type,collectionCode) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const structure = await jsonFromFile(path.join(__dirname, './structure.json'));

    const metaCollection = mongoClient.db("DB1").collection("Meta");
    const collectionMeta = await getCollectionMeta(mongoClient,type,);
    if (type == "Players") {
    }
}