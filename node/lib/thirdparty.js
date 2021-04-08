var tools = require('./tools'),
    SpotifyWebApi = require('spotify-web-api-node'),
    LastFmApi = require('lastfmapi'),
    LastFmApiNode = require('lastfm').LastFmNode,
    ua = require('universal-analytics');

var spotify, lastFmApi, lastFmNode, uaInstance;

module.exports = {
    getSpotifyApi: function() {
        return spotify || (spotify = new SpotifyWebApi({
            clientId: tools.spotifyClientId,
            clientSecret: tools.spotifyClientSecret,
            redirectUri: tools.spotifyRedirectUri
        }));
    },
    getLastFmApi: function() {
        return lastFmApi || (lastFmApi = new LastFmApi({
            'api_key': tools.lastFmApiKey,
            'secret': tools.lastFmApiSecret
        }));
    },
    getLastfmNodeApi: function() {
        return lastFmNode || (lastFmNode = new LastFmApiNode({
            api_key: tools.lastFmApiKey,
            secret: tools.lastFmApiSecret
        }));
    },
    recordUAEvent: function() {
        if (tools.analyticsKey && tools.analyticsKey.length) {
            uaInstance = uaInstance || ua(tools.analyticsKey);
            try {
                var ev = uaInstance.event.apply(uaInstance, arguments);
                if (ev) {
                    ev.save();
                }
            } catch (ex) {
                return undefined;
            }
        }
    }
};
