import { insert } from "../db/insert.js";

export async function reserveSpot(dbClient,data) {
    //reserves spot in database and gets an id and collection key;
    const { id, collectionCode } = await insert(dbClient,"Player");
    const response = {
        message: "success",
        body: {
            id: id,
            coll: collectionCode
        }
    }
    return response;
}