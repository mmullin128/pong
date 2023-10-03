import { getMeta } from "./metaActions.js";
import { get } from "./get.js";
import { UsernameTakenError } from "../errors/errors.js";

export async function checkUsername(mongoClient,id,collectionCode,username) {
    //adds player to appropriate collection recursively
    //add player to collection and increment meta
    const collectionData = await getMeta(mongoClient,"Player",collectionCode);
    const collection = mongoClient.db("DB1").collection(collectionData.collectionCode);
    const match = await collection.findOne(
        {
            "username": username,
            "id" : {
                $not: { $eq: id}
            }
        }
    )
    if (!match) {
        return true;
    }
    return false;
}