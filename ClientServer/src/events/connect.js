import { insert } from "../db/insert";
import { update } from "../db/update";

export async function connect(dbClient,data) {
    //reserves spot in database and gets an id and collection key;
    const { id, collectionCode } = data;
    const response = {
        message: "success",
        body: {
            id: id,
            coll: collectionCode
        }
    }
    return response;
}