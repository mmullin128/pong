import { insert } from "../db/insert.js";

export async function reserveSpot(dbClient,data) {
    //reserves spot in database and gets an id and collection key;
    const { id, coll } = await insert(dbClient,"Player");
    const response = {
        name: "success",
        body: {
            id: id,
            coll: coll
        }
    }
    return response;
}