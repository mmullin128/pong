import { update } from "../db/update.js";
export async function findMatch(dbClient,req,res) {
    //reserves spot in database and gets an id and collection key;
    try {
        const id = req.body.id;
        const collectionCode = req.body.coll;
        await update(dbClient,"Player",id,collectionCode,{ "status": "Looking"});
        //const playerStatus = await addPlayer(dbClient,gameID,gameCollectionCode,id,collectionCode);
        res.status(200).json({ id: id, coll: collectionCode});
    } catch (err) {
        console.error(err);
        errorPage(req,res);
    }
}