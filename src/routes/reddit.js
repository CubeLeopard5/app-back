const fetch = require('node-fetch');
const auth = require("../middelwares/auth");
const session = require('express-session');

module.exports = function(app) {
    app.get("/reddit/me", auth, async (req, res) => {
        try {
            const result = await fetch(`https://oauth.reddit.com/api/v1/me`, {
                method: "GET",
                headers: {
                    "Authorization": `bearer ${session.reddit}`,
                },
            });
            const data = await result.json();
            res.status(200).json(data);
        } catch (error) {
            console.log("Error in /reddit/me: ", error);
            res.status(500).json({ "Server": "Crash" });
        }
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
                "Authorization": `bearer ${session.reddit}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: bodyDataUrl,
        });
        const data = await result.json();
        res.status(200).json(data);
    });

    app.post("/reddit/create_publication", auth, async(req, res) => {
        const { sr, text, title } = req.body;
        sr.forEach(async el => {
            const bodyData = {
                extension: 'json',
                kind: 'self',
                resubmit: 'true',
                sendreplies: 'true',
                sr: el,
                text: text,
                title: title,
            };
            const bodyDataUrl = new URLSearchParams(Object.entries(bodyData)).toString();
            console.log(el, text, title);
            const result = await fetch(`https://oauth.reddit.com/api/submit`, {
                method: "POST",
                headers: {
                    "Authorization": `bearer ${session.reddit}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: bodyDataUrl,
            });
            const data = await result.json();
            console.log(data);
        });
        res.status(200).json(null);
    });

    app.get("/reddit/my_subreddits", auth, async(req, res) => {
        const result = await fetch(`https://oauth.reddit.com/subreddits/mine/subscriber?raw_json=1`, {
            method: "GET",
            headers: {
                "Authorization": `bearer ${session.reddit}`,
            },
        });
        const data = await result.json();
        res.status(200).json(data);
    });

    app.post("/reddit/subreddit_posts", auth, async(req, res) => {
        const { subRedditName, next, limit } = req.body;
        let url = null;

        if (!next) {
            url = `https://oauth.reddit.com/r/${subRedditName}?limit=${limit}&raw_json=1`;
        } else {
            url = `https://oauth.reddit.com/r/${subRedditName}?after=${next}&limit=${limit}&raw_json=1`;
        }

        const result = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `bearer ${session.reddit}`,
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
                "Authorization": `bearer ${session.reddit}`,
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
                "Authorization": `bearer ${session.reddit}`,
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
                "Authorization": `bearer ${session.reddit}`,
            },
        });
        const data = await result.json();
        res.status(200).json(data);
    });

    app.post("/reddit/search_user", auth, async(req, res) => {
        const { search } = req.body;

        const result = await fetch(`https://oauth.reddit.com/users/search?q=${search}`, {
            method: "GET",
            headers: {
                "Authorization": `bearer ${session.reddit}`,
            },
        });
        const data = await result.json();
        res.status(200).json(data);
    });

    app.post("/reddit/reddit_user_posts", auth, async(req, res) => {
        const { redditUser, next, limit } = req.body;
        let url = null;

        url = `https://oauth.reddit.com/user/${redditUser}/submitted.json`;

        console.log(url);
        const result = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `bearer ${session.reddit}`,
            },
        });
        const data = await result.json();
        res.status(200).json(data);
    });
};