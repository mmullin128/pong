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
export async function joinWithLink(dbClient,req, res) {
    try {
        req.body.gameID = req.params.gameID;
        req.body.collectionCode = req.params.coll;
        const game = await get(dbClient,"Game",req.body.gameID,req.body.collectionCode);
        if (!game) throw new Error(`Couldn';t find: ${req.body.gameID},${req.body.collectionCode}`);
        const { id, collectionCode } = await insert(dbClient,"Player");
        const playerStatus = await addPlayer(dbClient,req.body.gameID,req.body.collectionCode,id,collectionCode);
        res.render('index', {mainMenuDisplay: "none", usernameDisplay: "flex"}, (err,html) => {
            if (err) throw err;
            res.status(200).json({ html: html, data: { id: id, coll: collectionCode }})
        });
    } catch (err) {
        console.error(err);
        errorPage(req,res);
    }
}