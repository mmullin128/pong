import { getMeta } from "../db/metaActions.js";
export async function getServers(dbClient,req,res) {
    //reserves spot in database and gets an id and collection key;
    try {
        const getResponse = await getMeta(dbClient,"Servers");
        //const playerStatus = await addPlayer(dbClient,gameID,gameCollectionCode,id,collectionCode);
        res.status(200).json({ servers: getResponse});
    } catch (err) {
        console.error(err);
        errorPage(req,res);
    }
}