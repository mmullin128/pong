import { get } from "../db/get.js";
import { insert } from "../db/insert.js";
import { getMeta } from "../db/metaActions.js";
import { update } from "../db/update.js";
import { errorPage } from "./errorPage.js";
import { addPlayer } from "../db/addPlayer.js";
import { joinWithCode } from "./joinWithCode.js";
// check that gameID is valid and that the game is not full
// if invalid gameID, pass to oops middleware
// if game is full:
//  render html with status set to spectating,
//  pass to join as spectator middleware
// else:
//  render html with status set to select username,
//  pass to join game middleware
export async function createPrivateGame(dbClient,req, res) {
    try {
        const { id, collectionCode } = await insert(dbClient,"Game");
        //console.log("create game", req.body);
        await update(dbClient,"Game",id,collectionCode,{});
        await update(dbClient,"Game",id,collectionCode,{
            "gameSettings": req.body.gameSettings, 
            "max": req.body.gameSettings.max,
            "status": "Idle"
        });
        res.status(200).json({
            id: id,
            coll: collectionCode,
            link: `/pv/${id}/`
        })
    } catch (err) {
        console.error(err);
        errorPage(req,res);
    }
}