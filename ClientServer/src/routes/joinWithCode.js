import { errorPage } from "./errorPage.js";

import { get } from "../db/get.js";
import { addPlayer } from "../db/addPlayer.js";
// check that gameID is valid and that the game is not full
// if invalid gameID, pass to oops middleware
// if game is full:
//  render html with status set to spectating,
//  pass to join as spectator middleware
// else:
//  render html with status set to select username,
//  pass to join game middleware
export async function joinWithCode(dbClient,req, res) {
    try {
        //console.log('join with code', req.body);
        const gameID = req.body.gameID;
        const gameCollectionCode = gameID.charAt(0);
        const id = req.body.id;
        const collectionCode = req.body.coll;
        const game = await get(dbClient,"Game",gameID,gameCollectionCode);
        if (!game) throw new Error(`Couldn't find: ${gameID},${gameCollectionCode}`);
        const playerStatus = await addPlayer(dbClient,gameID,gameCollectionCode,id,collectionCode);
        res.status(200).json({ playerStatus: playerStatus });
    } catch (err) {
        console.error(err);
        errorPage(req,res);
    }
}