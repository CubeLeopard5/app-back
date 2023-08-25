const fetch = require('node-fetch');
const auth = require("../middelwares/auth");
const session = require('express-session');

module.exports = function(app) {
    app.get("/linkedin/me", auth, async (req, res) => {
        try {
            const result = await fetch(`https://api.linkedin.com/v2/me`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${session.linkedin}`,
                },
            });
            const data = await result.json();
            res.status(200).json(data);
        } catch (error) {
            console.log("Error in /linkedin/me: ", error);
            res.status(500).json({ "Server: /linkedin/me": error });
        }
    });
};