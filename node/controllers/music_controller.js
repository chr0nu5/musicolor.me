var rs = require('request-promise');

var tools = require('../lib/tools'),
    Moods = require('../lib/moods'),
    mongo = require('../lib/mongo'),
    thirdparty = require('../lib/thirdparty');

var moods = new Moods();

module.exports = {
    getSong: (req, res, token) => {
        var song = req.body.song,
            artist = req.body.artist;
        tools.searchSong(song, artist, token)
            .then(info => {
                var mood = moods.NearestFeeling({
                    energy: info.energy,
                    valence: info.valence
                });
                mongo.getInstance(db => {
                    db.collection('moods')
                        .findOne({
                            mood: mood.mood
                        }, (err, item) => {
                            if(!err) {
                                res.json({
                                    mood: mood,
                                    preview_url: info.preview_url,
                                    playlist_url: item ? item.url : ""
                                });
                            } else {
                                return Promise.reject(err);
                            }
                        });
                });
            })
            .catch(ex => {
                res.json({
                    error: true,
                    msg: ex
                });
            });
        thirdparty.recordUAEvent('Backend', 'get_song', 'Song', `${artist} ${song}`);
    },
    getPlaylistForMood: (req, res) => {
        // FIXME: Rewrite this whole logic
        var mood = req.params.mood;
        var songs = [];
        var ids = [];

        function process_songs() {
            if (songs.length > 0 && songs[0].indexOf('spotify:track') < 0) {
                rs({
                        uri: `https://api.spotify.com/v1/search?query=${encodeURIComponent(songs[0])}&offset=0&limit=1&type=track`,
                        json: true
                    })
                    .then((data) => {
                        if (data.tracks.items.length > 0) {
                            ids.push(data.tracks.items[0].uri);
                        }
                        songs.shift();
                        if (ids.length < 25) {
                            process_songs();
                        } else {
                            songs = [];
                            process_songs();
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        res.json({
                            "error": true,
                            "msg": "Error processing mood"
                        });
                    });
            } else {
                if (songs.length > 0) {
                    ids = songs;
                }
                mongo.getInstance((db) => {
                    db.collection('moods').updateOne({
                        "mood": mood
                    }, {
                        $set: {
                            "songs": ids,
                        }
                    }, (err, results) => {
                        if (!err) {
                            thirdparty.getSpotifyApi().createPlaylist('227zpb4bj4r6hlmdopa7xaq4a', `${mood.toUpperCase()} by MusicMood`, {
                                    'public': true
                                })
                                .then(function(data) {
                                    mongo.getInstance((db) => {
                                        db.collection('moods').updateOne({
                                            "mood": mood
                                        }, {
                                            $set: {
                                                "url": data.body.external_urls.spotify,
                                            }
                                        }, (err, results) => {
                                            if (!err) {
                                                thirdparty.getSpotifyApi().addTracksToPlaylist('227zpb4bj4r6hlmdopa7xaq4a', data.body.id, ids)
                                                    .then(function(data) {
                                                        res.json({
                                                            "error": false,
                                                            "playlist_url": data.body.external_urls.spotify
                                                        });
                                                    }, function(err) {
                                                        console.log(err);
                                                    });

                                            } else {
                                                reject(err);
                                            }
                                        });
                                    });
                                }, function(err) {
                                    console.log(err);
                                    res.json({
                                        "error": true,
                                        "msg": "Error processing mood"
                                    });
                                });
                        } else {
                            res.json({
                                "error": true,
                                "msg": "Error processing mood"
                            });
                        }
                    });
                });
            }
        }

        return new Promise((resolve, reject) => {
                mongo.getInstance((db) => {
                    db.collection('moods')
                        .findOne({
                            mood: mood
                        }, (err, item) => {
                            if (!err) {
                                if (item) {
                                    resolve(item);
                                } else {
                                    var url = `http://developer.echonest.com/api/v4/song/search?api_key=${tools.echonestApiKey}&format=json&results=100&mood=${mood}&sort=mode-desc`;
                                    rs({
                                            uri: url,
                                            json: true
                                        })
                                        .then((data) => {
                                            var items = data.response.songs;
                                            db.collection('moods').insertOne({
                                                mood: mood,
                                                songs: items
                                            }, (err, item) => {
                                                if (!err) {
                                                    db.collection('moods')
                                                        .findOne({
                                                            mood: mood
                                                        }, (err, item) => {
                                                            if (!err) {
                                                                if (item) {
                                                                    resolve(item);
                                                                } else {
                                                                    reject("MOOD_NOT_FOUND");
                                                                }
                                                            } else {
                                                                reject(err);
                                                            }
                                                        })
                                                } else {
                                                    reject(err);
                                                }
                                            });
                                        })
                                }
                            } else {
                                reject(err);
                            }
                        });
                });
            })
            .then((mood) => {
                if (mood.url) {
                    res.json({
                        "error": false,
                        "playlist_url": mood.url
                    });
                } else {
                    var url;
                    mood.songs.forEach((item) => {
                        songs.push(`${item.artist_name} ${item.title}`);
                    });
                    process_songs();
                }
            })
            .catch((err) => {
                console.log(err);
                res.json({
                    "error": true,
                    "msg": "Error processing mood"
                });
            });
        }
};
