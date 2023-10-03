import { get } from "../db/get.js";
export async function checkPrivateGame(dbClient,data) {
    const { id, gameID } = data;
    //reserves spot in database and gets an id and collection key;
    const collectionCode = gameID.charAt(0);
    const gameData = await get(dbClient,"Games",gameID,collectionCode);
    const response = {
        name: "success",
        body: gameData
    }
    return response;
}