export async function errorPage(req, res) {
    res.status(400).render('error');
}