import { getMeta } from "./metaActions.js";

export async function update(mongoClient,type,id,collectionCode,update, options) {
    //adds player to appropriate collection recursively
    //add player to collection and increment meta
    const collectionData = await getMeta(mongoClient,type,collectionCode);
    const collection = mongoClient.db("DB1").collection(collectionData.name);
    let query = {}
    query["id"] = id;
    await collection.updateOne(query,{
        $set: update
    },
    options
    );
    return {
        message: "success"
    }
}