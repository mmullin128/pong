import { update } from "../db/update.js";
export async function readyUp(dbClient,data) {
    const { id, coll, value } = data;
    //reserves spot in database and gets an id and collection key;
    await update(dbClient,"Player",id,coll,{ "ready": value });
    const response = {
        name: "success",
        body: {}
    }
    return response;
}