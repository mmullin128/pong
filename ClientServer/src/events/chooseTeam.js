import { update } from "../db/update.js";
export async function chooseTeam(dbClient,data) {
    const { id, collectionCode, team } = data;
    //reserves spot in database and gets an id and collection key;
    await update(dbClient,"Player",id,collectionCode,"team",team);
    const response = {
        message: "success",
        body: {}
    }
    return response;
}