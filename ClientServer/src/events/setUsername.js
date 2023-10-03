import { update } from "../db/update.js";
import { checkUsername } from "../db/checkUsername.js";
import { get } from "../db/get.js";
export async function setUsername(dbClient,data) {
    const { id, coll, username } = data;
    //reserves spot in database and gets an id and collection key;
    let response = {
        name: "success",
        body: {
            username: username
        }
    };
    const player = await get(dbClient,"Player",id,coll);
    if (player.status == "InGame") {
        await update(dbClient,"Player",id,coll,{ "username": username });
        return response;
    }
    const available = await checkUsername(dbClient,id,coll,username);
    if (available) {
        await update(dbClient,"Player",id,coll,{ "username": username });
    } else {
        response = { name: "checkUsername", body: { taken: true }}
    }
    return response;
}