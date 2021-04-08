var thirdparty = require('../lib/thirdparty');

module.exports = {
    token: (req, res) => {
        var authorizeURL = thirdparty.getSpotifyApi().createAuthorizeURL(['playlist-modify-public'], 'state');
        res.redirect(authorizeURL);
    },
    callback: (req, res) => {
        // Retrieve an access token and a refresh token
        var sp = thirdparty.getSpotifyApi();
        sp.authorizationCodeGrant(req.param('code'))
            .then((data) => {
                sp.setAccessToken(data.body.access_token);
                sp.setRefreshToken(data.body.refresh_token);
                res.json(data.body);
            })
            .catch((err) => {
                console.log(err);
            });
    },
    refresh: (req, res) => {
        spotifyApi.refreshAccessToken()
            .then((data) => {
                spotifyApi.setAccessToken(data.body.access_token);
                res.json(data);
            })
            .catch((err) => {
                console.log(err);
                res.redirect('/token');
            });
    }
};
