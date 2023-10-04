import { get } from "../db/get.js";
export async function checkStatus(dbClient,data) {
    const { id, coll } = data;
    //reserves spot in database and gets an id and collection key;
    const player = await get(dbClient,"Players",id,coll);
    const response = {
        name: "checkStatus",
        body: {
            status: player.status
        }
    }
    return response;
}