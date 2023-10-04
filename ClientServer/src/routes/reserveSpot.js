import { insert } from "../db/insert.js";

export async function reserveSpot(dbClient,req,res) {
    //reserves spot in database and gets an id and collection key;
    try {
        const { id, collectionCode } = await insert(dbClient,"Player");
        //const playerStatus = await addPlayer(dbClient,gameID,gameCollectionCode,id,collectionCode);
        res.status(200).json({ id: id, coll: collectionCode});
    } catch (err) {
        console.error(err);
        errorPage(req,res);
    }
}