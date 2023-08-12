const fetch = require('node-fetch');
const auth = require("../middelwares/auth");
const session = require('express-session');

module.exports = function(app) {
    app.get("/reddit/me", auth, async (req, res) => {
        console.log("OK = ", session.redditToken);
        const result = await fetch(`https://oauth.reddit.com/api/v1/me`, {
            method: "GET",
            headers: {
                "Authorization": `bearer ${session.redditToken}`,
            },
        });
        const data = await result.json();
        res.status(200).json(data);
    });
};