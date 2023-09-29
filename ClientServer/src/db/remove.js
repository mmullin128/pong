import { decrement, getMeta } from "./metaActions.js";

export async function remove(mongoClient,collectionName,id,collectionCode) {
    //adds player to appropriate collection recursively
    //add player to collection and increment meta
    if (collectionCode != undefined) {
        const collectionData = await getMeta(mongoClient,collectionName,collectionCode);
        collectionName = collectionData.name;
    }
    const collection = mongoClient.db("DB1").collection(collectionName);
    await collection.deleteOne({ id: id });
    await decrement(mongoClient,collectionName);
}