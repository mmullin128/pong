import { checkUsername as checkUsernameDB } from "../db/checkUsername.js";
export async function checkUsername(dbClient,data) {
    const { id, coll, gameID, username } = data;
    //reserves spot in database and gets an id and collection key;
    console.log('check username', username);
    const available = await checkUsernameDB(dbClient,id,coll,username);
    const response = {
        name: "checkUsername",
        body: {
            taken: !available
        }
    }
    return response;
}