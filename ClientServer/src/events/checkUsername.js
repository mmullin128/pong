import { checkUsername as checkUsernameDB } from "../db/checkUsername.js";
export async function checkUsername(dbClient,data) {
    const { id, collectionCode, username } = data;
    //reserves spot in database and gets an id and collection key;
    const taken = checkUsernameDB(dbClient,id,collectionCode,username);
    const response = {
        message: "success",
        body: {
            taken: taken
        }
    }
    return response;
}