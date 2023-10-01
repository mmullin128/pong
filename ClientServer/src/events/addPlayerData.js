import { update } from "../db/update.js";
export async function addPlayerData(dbClient,data) {
    const { id, collectionCode, playerData } = data;
    //reserves spot in database and gets an id and collection key;
    await update(dbClient,"Player",id,collectionCode,"playerData",playerData);
    const response = {
        message: "success",
        body: {}
    }
    return response;
}