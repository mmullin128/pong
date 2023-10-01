import { update } from "../db/update.js";
import { checkUsername } from "../db/checkUsername.js";
export async function setUsername(dbClient,data) {
    const { id, collectionCode, username } = data;
    //reserves spot in database and gets an id and collection key;
    const taken = await checkUsername(dbClient,id,collectionCode,username);
    if (!taken) {
        await update(dbClient,"Player",id,collectionCode,"username",username);
        const response = {
            message: "success",
            body: {
                username: username
            }
        }
        return response;
    } 
    return {
        message: "failed",
        body: {
            error: "UsernameTaken"
        }
    }
}