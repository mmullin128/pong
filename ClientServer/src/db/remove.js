import { decrement, getMeta } from "./metaActions.js";

export async function remove(mongoClient,type,id,collectionCode) {
    //adds player to appropriate collection recursively
    //add player to collection and increment meta
    const collectionData = await getMeta(mongoClient,type,collectionCode);
    const collection = mongoClient.db("DB1").collection(collectionData.name);
    await collection.deleteOne({ id: id });
    await decrement(mongoClient,collectionData.name);
}