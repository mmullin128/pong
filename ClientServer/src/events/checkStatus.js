import { get } from "../db/get.js";
export async function checkStatus(dbClient,data) {
    const { id, collectionCode } = data;
    //reserves spot in database and gets an id and collection key;
    const player = await get(dbClient,"Players",id,collectionCode);
    const response = {
        message: "success",
        body: {
            status: player.status
        }
    }
    return response;
}