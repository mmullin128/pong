import { update } from "../db/update.js";
export async function addPlayerData(dbClient,data) {
    const { id, coll, playerData } = data;
    //reserves spot in database and gets an id and collection key;
    await update(dbClient,"Player",id,coll,{ "playerData": playerData });
    const response = {
        name: "success",
        body: {
            "request": {
                "name": "addPlayerData",
                "body": data 
            }
        }
    }
    return response;
}