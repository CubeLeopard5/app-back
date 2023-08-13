const session = require('express-session');
const fetch = require('node-fetch');

module.exports = function(app) {
    app.get('/auth/reddit', function(req, res) {
        res.redirect(`https://www.reddit.com/api/v1/authorize?client_id=${process.env['REDDIT_CLIENT_ID']}&response_type=code&state=sdfghjkl&redirect_uri=${process.env['REDDIT_CALLBACK_URL']}&duration=permanent&scope=identity privatemessages submit mysubreddits read account`);
    });
    
    app.get('/auth/reddit/callback', async function(req, res) {
        const bodyData = {
            grant_type: 'authorization_code',
            code: req.query.code,
            redirect_uri: process.env['REDDIT_CALLBACK_URL'],
        };
        const bodyDataUrl = new URLSearchParams(Object.entries(bodyData)).toString();
    
        const result = await fetch(`https://www.reddit.com/api/v1/access_token`, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${process.env['REDDIT_BASE_64']}`,
                'Content-Type': "application/x-www-form-urlencoded",
            },
            body: bodyDataUrl,
        });
        const data = await result.json();
        console.log(data);
        session.redditToken = data.access_token;
        console.log(session);
        res.redirect("http://localhost:3000/home");
    });
};