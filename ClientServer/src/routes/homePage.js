import { errorPage } from "./errorPage.js";
//render html with status set to homepage
//if error pass to error route
export function homePage(req, res) {
    try {
        res.render('index', {mainMenuDisplay: "flex", usernameDisplay: "none"}, (err,html) => {
            if (err) throw err;
            res.status(200).send(html);
        });
    } catch (err) {
        errorPage(req,res);
    }
}