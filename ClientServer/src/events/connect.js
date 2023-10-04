import { get } from "../db/get.js";
import { update } from "../db/update.js";
export async function connect(dbClient,data) {
    const { id, coll } = data;
    console.log("connect", id);
    //reserves spot in database and gets an id and collection key;
    let response = {
        name: "disconnect",
        body: {
            "request": {
                "name": "connect",
                "body": data 
            }
        }
    }
    try {
        const exists = await get(dbClient,"Player",id,coll);
        if (exists) {
            await update(dbClient,"Player",id,coll,{ "connected": true, "time": Date.now() });
            response.name = "success";
        }
    } finally {
        return response;
    }
    
}