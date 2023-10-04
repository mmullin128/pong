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
export async function joinPage(dbClient,req, res) {
    try {
        //render username page
        res.render('index', {mainMenuDisplay: "", usernameDisplay: "showing"}, (err,html) => {
            if (err) throw err;
            res.status(200).send(html);
        });
    } catch (err) {
        console.error(err);
        errorPage(req,res);
    }
}