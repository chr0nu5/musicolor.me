var Moods = require('../lib/moods'),
    thirdparty = require('../lib/thirdparty'),
    tools = require('../lib/tools');

var moods = new Moods();
var spotifyToken = '';

module.exports = {
    index: (req, res, token) => {
        spotifyToken = token;
        res.render('index.html', {
            "moods": moods.moods.filter((value, index) => index > 1),
            "user": req.user
        });
    },
    list: (req, res) => {
        res.json({
            moods: moods.moods
                .filter((value, index) => index > 1)
                .map(m => ({
                    mood: m.mood,
                    color: m.color
                }))
        });
    },
    moodForSong: (req, res) => {
        var song = req.params.song,
            artist = req.params.artist;
        tools.searchSong(song, artist, spotifyToken)
            .then(info => {
                var mood = moods.NearestFeeling({
                    energy: info.energy,
                    valence: info.valence
                });
                res.json({
                    error: false,
                    mood: mood.mood,
                    color: mood.color,
                    // If you need, you can also send the preview url
                    // preview_url: info.preview_url
                });
            })
            .catch(ex => {
                res.json({
                    error: true,
                    msg: 'Artist/Song could not be found.'
                });
            });
        thirdparty.recordUAEvent('Backend', 'api_mood', 'Song', `${artist} ${song}`);
    }
};
