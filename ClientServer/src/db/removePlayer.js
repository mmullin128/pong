import { generateID } from "../../utils/idGenerators.js";
import { getCollectionMeta } from "./getCollectionMeta.js";
import { decrement } from "./metaActions.js";

export async function removePlayer(mongoClient,collectionName,id) {
    //adds player to appropriate collection recursively
    //add player to collection and increment meta
    const playersCollection = mongoClient.db("DB1").collection(collectionName);
    await playersCollection.deleteOne({ id: id });
    await decrement(mongoClient,"Players",collectionName);
}