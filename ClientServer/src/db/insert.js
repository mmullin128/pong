import { generateID } from "../../utils/idGenerators.js";
import { getMeta } from "./metaActions.js";
import { increment } from "./metaActions.js";
import { remove } from "./remove.js";
import { getCodes } from "./metaActions.js";
import { mongoClient } from "./mongoClient.js";

export async function insert(mongoClient,type,codes,collectionNum=1) {
    //adds document to appropriate collection recursively
    //add document to collection and increment meta
    if (codes == undefined) {
        codes = await getCodes(mongoClient,type);
    }
    const collectionData = await getMeta(mongoClient,type,codes[collectionNum-1]);
    //if there is space add to collection, else increase collection num
    if (collectionData.current < collectionData.max) {
        let id = generateID(4,collectionData.collectionCode);
        while (await hasID(mongoClient,collectionData.name,id)) {
            id = generateID(4,collectionData.collectionCode);
        }
        const doc = { id: id, status: "Idle", time: Date.now() };
        const collection = mongoClient.db("DB1").collection(collectionData.name);
        //console.log(`adding: `, id ,collectionData.name);
        await collection.insertOne(doc);
        await increment(mongoClient,collectionData.name);
        const updatedCollectionData = await getMeta(mongoClient,type,codes[collectionNum-1]);
        if (updatedCollectionData.current > updatedCollectionData.max) {
            //console.log('overflow', collectionData.name,id);
            //console.log(`removing: `, id ,collectionData.name);
            await remove(mongoClient,type,id,collectionData.collectionCode);
            return insert(mongoClient,type,codes,collectionNum+1);
        } else {
            return { id: id, collectionCode: collectionData.collectionCode};
        }
    } else {
        return insert(mongoClient,type,codes,collectionNum+1);
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