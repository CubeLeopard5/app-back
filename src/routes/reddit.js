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

    app.get("/reddit/my_subreddits", auth, async(req, res) => {
        const result = await fetch(`https://oauth.reddit.com/subreddits/mine/subscriber?raw_json=1`, {
            method: "GET",
            headers: {
                "Authorization": `bearer ${session.redditToken}`,
            },
        });
        const data = await result.json();
        res.status(200).json(data);
    });

    app.post("/reddit/subreddit_posts", auth, async(req, res) => {
        const { subredditName } = req.body;

        const result = await fetch(`https://oauth.reddit.com/r/${subredditName}?raw_json=1`, {
            method: "GET",
            headers: {
                "Authorization": `bearer ${session.redditToken}`,
            },
        });
        const data = await result.json();
        res.status(200).json(data);
    });

    app.post("/reddit/search_subreddits", auth, async(req, res) => {
        const bodyData = {
            query: req.body.search,
        };
        const bodyDataUrl = new URLSearchParams(Object.entries(bodyData)).toString();

        const result = await fetch(`https://oauth.reddit.com/api/search_reddit_names`, {
            method: "POST",
            headers: {
                "Authorization": `bearer ${session.redditToken}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: bodyDataUrl
        });
        const data = await result.json();
        res.status(200).json(data);
    });

    app.post("/reddit/search_inside_subreddit", auth, async(req, res) => {
        const { subredditName, search } = req.body;

        const result = await fetch(`https://oauth.reddit.com/r/${subredditName}/search?q=${search}&restrict_sr=true`, {
            method: "GET",
            headers: {
                "Authorization": `bearer ${session.redditToken}`,
            },
        });
        const data = await result.json();
        res.status(200).json(data);
    });

    app.post("/reddit/search_subreddits_autocomplete", auth, async(req, res) => {
        const { search } = req.body;

        const result = await fetch(`https://oauth.reddit.com/api/subreddit_autocomplete_v2?query=${search}`, {
            method: "GET",
            headers: {
                "Authorization": `bearer ${session.redditToken}`,
            },
        });
        const data = await result.json();
        res.status(200).json(data);
    });
};