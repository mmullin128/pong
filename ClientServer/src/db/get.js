import { getMeta } from "./metaActions.js";
import { InvalidIDError } from "../errors/errors.js";
export async function get(mongoClient,type,id,collectionCode) {
    //adds player to appropriate collection recursively
    //add player to collection and increment meta
    const collectionData = await getMeta(mongoClient,type,collectionCode);
    const collectionName = collectionData.name;
    const collection = mongoClient.db("DB1").collection(collectionName);
    const doc = await collection.findOne({ id: id });
    if (!doc) throw new InvalidIDError(type,id);
    return doc;
}