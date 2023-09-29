import { getMeta } from "./metaActions.js";

export async function update(mongoClient,collectionName,id,field,value,collectionCode) {
    //adds player to appropriate collection recursively
    //add player to collection and increment meta
    if (collectionCode) {
        const collectionData = await getMeta(mongoClient,collectionName,collectionCode);
        collectionName = collectionData.name;
    }
    const collection = mongoClient.db("DB1").collection(collectionName);
    let query = {}
    let update = {};
    query["id"] = id;
    update[field] = value;
    await collection.updateOne(query,{
        $set: update
    });
}