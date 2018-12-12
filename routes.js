module.exports = function(app) {

    /* Route 1: /splash */
    app.get('/(splash)?', function(req, res) {
        res.sendFile("splash.html", {root: "./static"});
    })

    /* Route 2: /game */
    app.get('/game', function(req, res) {
        res.sendFile("game.html", {root: "./static"});
    })
}