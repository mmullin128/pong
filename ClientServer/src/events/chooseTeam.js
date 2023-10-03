import { update } from "../db/update.js";
export async function chooseTeam(dbClient,data) {
    const { id, coll, team } = data;
    //reserves spot in database and gets an id and collection key;
    await update(dbClient,"Player",id,coll,{ "team": team });
    const response = {
        name: "success",
        body: {}
    }
    return response;
}