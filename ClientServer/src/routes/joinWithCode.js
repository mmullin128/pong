import { errorPage } from "./errorPage.js";
// check that gameID is valid and that the game is not full
// if invalid gameID, pass to oops middleware
// if game is full:
//  render html with status set to spectating,
//  pass to join as spectator middleware
// else:
//  render html with status set to select username,
//  pass to join game middleware
export function joinWithCode(req, res) {
    try {
        
    } catch (err) {
        errorPage(req,res);
    }
}