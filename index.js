const express = require("express");
const cookieParser = require('cookie-parser');

const csrfPrevention = require('./middleware/csrf_prevention');

require('dotenv').config();

const app = express();

const domain = process.env.DOMAIN
const port = process.env.PORT

app.use(cookieParser())


//request for Double Submit Cookie
app.post('/setCSRFTokenDSC',

    csrfPrevention.generateCSRFToken,
    function (req, res) {
        console.log("Inside here");
        res.status(200)
            .cookie('CSRF_TOKEN', req.csrf_token, {
                secure: true, // Ensures the browser only sends the cookie over HTTPS. false for localhost.
                httpOnly: true, //Ensures the cookie is sent only over HTTP(S)
                sameSite: true, // Cookies will only be sent in a first-party context. 'lax' is default value for third-parties.
                encode: String, //Specifies a function to use for encoding the cookie value.
                domain: process.env.DOMAIN, //Used to compare against the domain of the server in which the URL is being requested.
                expires: new Date(Date.now() + parseInt(process.env.CSRF_TOKEN_COOKIE_EXPIRESIN))
            })
            .json({ result: true, csrf_token: req.csrf_token });
    }
);

app.post('/checkCSRFTokenDSC', csrfPrevention.checkCSRFTokenDSC, function (req, res) {
    res.send({ result: true, message: 'Valid token.' });
});

app.listen(port, () => {
    console.log(`Listening at http://${domain}:${port}`)
});

