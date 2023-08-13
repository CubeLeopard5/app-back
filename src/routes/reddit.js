const fetch = require('node-fetch');
const auth = require("../middelwares/auth");
const session = require('express-session');

module.exports = function(app) {
    app.get("/reddit/me", auth, async (req, res) => {
        const result = await fetch(`https://oauth.reddit.com/api/v1/me`, {
            method: "GET",
            headers: {
                "Authorization": `bearer ${session.redditToken}`,
            },
        });
        const data = await result.json();
        res.status(200).json(data);
    });

    app.post("/reddit/send_message", auth, async(req, res) => {
        const bodyData = {
            to: req.body.to,
            subject: req.body.subject,
            text: req.body.text,
        };
        const bodyDataUrl = new URLSearchParams(Object.entries(bodyData)).toString();

        const result = await fetch(`https://oauth.reddit.com/api/compose`, {
            method: "POST",
            headers: {
                "Authorization": `bearer ${session.redditToken}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: bodyDataUrl,
        });
        const data = await result.json();
        res.status(200).json(data);
    });

    app.post("/reddit/create_publication", auth, async(req, res) => {
        const bodyData = {
            /*description: req.body.description,
            title: req.body.title,
            api_type: "json",
            nsfw: "false",
            resources: null,*/

            extension: 'json',
            kind: 'self',
            resubmit: 'true',
            sendreplies: 'true',
            sr: "u_testcubedev",
            text: req.body.description,
            title: req.body.title,
        };
        const bodyDataUrl = new URLSearchParams(Object.entries(bodyData)).toString();

        const result = await fetch(`https://oauth.reddit.com/api/submit`, {
            method: "POST",
            headers: {
                "Authorization": `bearer ${session.redditToken}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: bodyDataUrl,
        });
        const data = await result.json();
        res.status(200).json(data);
    });
};