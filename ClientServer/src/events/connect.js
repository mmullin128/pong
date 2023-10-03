import { insert } from "../db/insert";
import { update } from "../db/update";

export async function connect(dbClient,data) {
    //reserves spot in database and gets an id and collection key;
    const { id, coll } = data;
    const response = {
        name: "success",
        body: {
            id: id,
            coll: coll
        }
    }
    return response;
}