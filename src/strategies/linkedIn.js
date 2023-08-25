const session = require('express-session');
const fetch = require('node-fetch');
const request = require('request');

module.exports = function(app) {
    app.get('/auth/linkedin', function(req, res) {
        const scope = encodeURIComponent('r_liteprofile r_emailaddress w_member_social');
        res.redirect(`https://www.linkedin.com/oauth/v2/authorization?client_id=${process.env['LINKEDIN_CLIEN_ID']}&response_type=code&state=sdfghjkl&redirect_uri=${process.env['LINKEDIN_CALLBACK_URL']}&scope=${scope}`);
    });

    app.get('/auth/linkedin/callback', async function(req, res) {
        console.log(req.query);
        const body = {
            grant_type: 'authorization_code',
            code: req.query.code,
            redirect_uri: process.env['LINKEDIN_CALLBACK_URL'],
            client_id: process.env['LINKEDIN_CLIEN_ID'],
            client_secret: process.env['LINKEDIN_CLIENT_SECRET']
        };

        const result = await new Promise((resolve, reject) => {
            request.post({url: `https://www.linkedin.com/oauth/v2/accessToken`, form: body}, (err, response, body) => {
                    if (err || response.statusCode !== 200) {
                        return reject(err || JSON.parse(body));
                    }
                    resolve(JSON.parse(body));
                }
            );
        });
        console.log(result);
        session.linkedin = result.access_token;
        console.log(session);
        res.redirect("http://localhost:3000/comptes");
    });
};