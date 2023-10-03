import { update } from "../db/update.js";
import { checkUsername } from "../db/checkUsername.js";
export async function setUsername(dbClient,data) {
    const { id, coll, username } = data;
    //reserves spot in database and gets an id and collection key;
    const taken = await checkUsername(dbClient,id,coll,username);
    if (!taken) {
        await update(dbClient,"Player",id,coll,{ "username": username });
        const response = {
            name: "success",
            body: {
                username: username
            }
        }
        return response;
    } 
    return {
        name: "failed",
        body: {
            error: "UsernameTaken"
        }
    }
}