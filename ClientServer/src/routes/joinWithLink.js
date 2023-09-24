import { errorPage } from "./errorPage.js";
// check that gameID is valid and that the game is not full
// if invalid gameID, pass to oops middleware
// if game is full:
//  render html with status set to spectating,
//  pass to join as spectator middleware
// else:
//  render html with status set to select username,
//  pass to join game middleware
export function joinWithLink(req, res) {
    try {
        res.render('index', {mainMenuDisplay: "none", usernameDisplay: "flex"}, (err,html) => {
            if (err) throw err;
            res.status(200).send(html);
        });
    } catch (err) {
        errorPage(req,res);
    }
}