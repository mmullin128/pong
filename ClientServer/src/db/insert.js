import { generateID } from "../../utils/idGenerators.js";
import { getMeta } from "./metaActions.js";
import { increment } from "./metaActions.js";
import { remove } from "./remove.js";

export async function insert(mongoClient,type,collectionNum=1) {
    //adds document to appropriate collection recursively
    //add document to collection and increment meta
    if (type.charAt(0) == 'P') type = "Players";
    if (type.charAt(0) == 'G') type = "Games";
    const collectionData = await getMeta(mongoClient,type + collectionNum);
    if (collectionData.current < collectionData.max) {
        let id = generateID(4,collectionData.collectionCode);
        while (await hasID(mongoClient,collectionData.name,id)) {
            id = generateID(4,collectionData.collectionCode);
        }
        const doc = { id: id };
        const collection = mongoClient.db("DB1").collection(collectionData.name);
        await collection.insertOne(doc);
        await increment(mongoClient,collectionData.name);
        const updatedCollectionData = await getMeta(mongoClient,type + collectionNum);
        if (updatedCollectionData.current > updatedCollectionData.max) {
            console.log('overflow', collectionData.name,id);
            await remove(mongoClient,collectionData.name,id);
            return insert(mongoClient,type,collectionNum+1);
        } else {
            return { id: id, collectionCode: collectionData.collectionCode};
        }
    } else {
        return insert(mongoClient,type,collectionNum+1);
    }
}

export async function hasID(mongoClient,collectionName,id) {
    const collection = mongoClient.db("DB1").collection(collectionName);
    const doc = await collection.findOne({
        id: id
    });
    if (doc) return true;
    if (!doc) return false;
}