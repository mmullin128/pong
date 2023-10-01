import { update } from "../db/update.js";
export async function readyUp(dbClient,data) {
    const { id, collectionCode } = data;
    //reserves spot in database and gets an id and collection key;
    await update(dbClient,"Player",id,collectionCode,"ready",1);
    const response = {
        message: "success",
        body: {}
    }
    return response;
}