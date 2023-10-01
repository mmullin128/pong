import { getMeta } from "./metaActions.js";

export async function update(mongoClient,type,id,collectionCode,field,value) {
    //adds player to appropriate collection recursively
    //add player to collection and increment meta
    const collectionData = await getMeta(mongoClient,type,collectionCode);
    const collection = mongoClient.db("DB1").collection(collectionData.name);
    let query = {}
    let update = {};
    query["id"] = id;
    update[field] = value;
    await collection.updateOne(query,{
        $set: update
    });
}