import { update } from "../db/update.js";
export async function chooseTeam(dbClient,data) {
    const { id, gameID, team } = data;
    //reserves spot in database and gets an id and collection key;
    const gameColl = gameID.charAt(0);
    //await update(dbClient,"Player",id,coll,{ "team": team });
    await update(dbClient,"Game",gameID,gameColl,{ "players.$[i].team": team }, { arrayFilters: [ { "i.id": id} ]});
    const response = {
        name: "success",
        body: {
            request: data
        }
    }
    return response;
}