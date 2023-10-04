import { getMeta } from "./metaActions.js";
import { get } from "./get.js";
import { UsernameTakenError } from "../errors/errors.js";

export async function checkUsername(mongoClient,id,collectionCode,username) {
    //returns true if username is available

    const collectionData = await getMeta(mongoClient,"Player",collectionCode);
    const collection = mongoClient.db("DB1").collection(collectionData.name);
    const match = await collection.findOne(
        {
            "username": username,
            "id": {
                $not: {
                    $eq: id
                }
            }
        }
    )
    if (!match || ( match == {} )) {
        return true; 
    }
    return false;
}