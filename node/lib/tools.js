var fs = require('fs');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var rs = require('request-promise');
var mongo = require('./mongo');
var os = require('os');
var config = require('../config.json');

var echonestApiKey = config.echonestApiKey,
    duration = 0,
    fileType = 'mp3',
    beats_per_second = 50,
    energy = 0,
    valence = 0,
    socket_port = 3030,
    socket_server;

if (os.hostname() === 'vagrant-ubuntu-trusty-64') {
    // localhost inside vagrant
    socket_server = 'http://localhost';
} else {
    // vagrant private IP
    socket_server = 'http://192.168.33.10';
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function fileExists(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    } catch (err) {
        return false;
    }
}

function createFolder() {
    var dir = 'mkdir -p ../tmp';
    var child = execSync(dir, (err, stdout, stderr) => {
        if (err) {
            return Promise.reject(new Error('ERROR_CREATING_FOLDER'));
        }
    });
}

function logBPM(filePath) {
    return new Promise((resolve, reject) => {
        if (!fileExists(filePath)) {
            reject(`File not found ${filePath}`);
        }
        var processFile = exec(`python ../python/processor.py ${filePath} ${duration} ${beats_per_second}`, {
            maxBuffer: 1024 * 10000
        }, (err, stdout, stderr) => {
            if (err) {
                reject(`logBPM ${err}`);
            } else {
                var json = JSON.parse(stdout.replace('\n', ''));
                if (json.harper.length === 0) {
                    reject('ERROR_PROCESSING_FILE');
                } else {
                    resolve(json);
                }
            }
        });
    });
}

function downloadFile(preview_url, filePath) {
    return new Promise((resolve, reject) => {
        rs.get(preview_url)
            .on('error', (err) => reject(`downloadFile ${err}`))
            .on('end', () => resolve(filePath))
            .pipe(fs.createWriteStream(filePath));
    });
}

function createTrack(info) {
    return new Promise((resolve, reject) => {
        mongo.getInstance((db) => {
            db.collection('songs').insertOne(info, (err, r) => {
                if (!err) {
                    var file = `../tmp/${info.slug}.${fileType}`;
                    fs.exists(file, (exists) => {
                        if (exists) {
                            fs.unlink(file);
                        }
                    });
                    resolve(info);
                } else {
                    reject(`createTrack 1 ${err}`);
                }
            });
        })
    })
}

module.exports = {
    lastFmApiKey: config.lastFmApiKey,
    lastFmApiSecret: config.lastFmApiSecret,
    echonestApiKey: config.echonestApiKey,
    spotifyClientId: config.spotifyClientId,
    spotifyClientSecret: config.spotifyClientSecret,
    spotifyRedirectUri: config.spotifyRedirectUri,
    analyticsKey: config.analyticsKey,
    beatsPerSecond: beats_per_second,
    socketServer: socket_server,
    socketPort: socket_port,
    processTrack: (track, user) => {
        if (track && !!track.name) {
            return new Promise((resolve, reject) => {
                mongo.getInstance((db) => {
                    db.collection('songs')
                        .find({
                            slug: slugify(track.artist['#text'] + '-' + track.name),
                            beats_per_second: beats_per_second
                        })
                        .toArray((err, items) => {
                            if (items.length > 0) {
                                if ('@attr' in track) {
                                    if (track['@attr'].nowplaying) {
                                        resolve(items[0]);
                                    } else {
                                        reject('OLD_SONG');
                                    }
                                } else {
                                    reject('OLD_SONG');
                                }
                            } else {
                                var options = {
                                        uri: `http://developer.echonest.com/api/v4/artist/terms?api_key=${echonestApiKey}&format=json&name=${encodeURIComponent(track.artist['#text'])}`,
                                        json: true
                                    },
                                    genres = [],
                                    terms;
                                return rs(options)
                                    .then((data) => {
                                        if (!!data && !!data.response && !!data.response.terms) {
                                            data.response.terms.forEach((item) => genres.push(item.name));
                                        }

                                        options.uri = `http://developer.echonest.com/api/v4/song/search?api_key=${echonestApiKey}&format=json&results=1&artist=${encodeURIComponent(track.artist['#text'])}&title=${encodeURIComponent(track.name)}&bucket=audio_summary`;

                                        return rs(options)
                                            .then((data) => {
                                                if (!!data && !!data.response && !!data.response.songs && data.response.songs.length > 0) {
                                                    energy = data.response.songs[0].audio_summary.energy;
                                                    valence = data.response.songs[0].audio_summary.valence;
                                                }
                                                options.uri = `https://api.spotify.com/v1/search?query=${encodeURIComponent(track.name+' '+track.artist['#text'])}&offset=0&limit=50&type=track`;
                                                return rs(options);
                                            })
                                    })
                                    .then((data) => {
                                        var preview_url = undefined;
                                        if (!!data && !!data.tracks && !!data.tracks.items) {
                                            data.tracks.items.forEach((item) => {
                                                item.artists.forEach((artist) => {
                                                    var current_name = artist.name.toLowerCase().trim();
                                                    var playing_name = track.artist['#text'].toLowerCase().trim();
                                                    if (current_name.substring(0, 3) === "the") {
                                                        current_name = current_name.substring(3).trim();
                                                    }
                                                    if (playing_name.substring(0, 3) === "the") {
                                                        playing_name = playing_name.substring(3).trim();
                                                    }
                                                    if (current_name === playing_name) {
                                                        preview_url = item.preview_url;
                                                        duration = item.duration_ms;
                                                        fileType = 'mp3';
                                                    }
                                                });
                                            });

                                            if (preview_url) {
                                                return preview_url;
                                            } else {
                                                reject('NO_PREVIEW_FROM_SPOTIFY');
                                            }
                                        } else {
                                            reject('NO_PREVIEW_FROM_SPOTIFY');
                                        }

                                    })
                                    .then((preview_url) => {
                                        if (preview_url) {
                                            createFolder();
                                            var filePath = `../tmp/${slugify(track.artist['#text'] + '-' + track.name)}.${fileType}`;
                                            if (fileExists(filePath)) {
                                                return logBPM(filePath);
                                            } else {
                                                return downloadFile(preview_url, filePath)
                                                    .then(() => {
                                                        return logBPM(filePath);
                                                    });
                                            }
                                        } else {
                                            reject('NO_PREVIEW_FROM_SPOTIFY');
                                        }
                                    })
                                    .then((json) => {
                                        if (json) {
                                            var info = {
                                                slug: slugify(track.artist['#text'] + '-' + track.name),
                                                name: track.name,
                                                artist: track.artist['#text'],
                                                genres: genres,
                                                bpm: json.bpm,
                                                harper: json.harper,
                                                duration: duration,
                                                energy: energy,
                                                valence: valence,
                                                user: user,
                                                beats_per_second: beats_per_second
                                            }
                                            createTrack(info)
                                                .then((info) => {
                                                    resolve(info);
                                                });
                                        } else {
                                            reject('NO_JSON');
                                        }
                                    });
                            }
                        });
                });
            })
        } else {
            return Promise.reject('NO_MUSIC');
        }
    },
    searchSong: (song, artist, token) => {
        return new Promise((resolve, reject) => {
            if (song && artist) {
                var options = {
                    uri: ``,
                    json: true
                }
                var energy = 0;
                var valence = 0;
                var trackId = '';
                options.uri = `https://api.spotify.com/v1/search?query=${encodeURIComponent(song+' '+artist)}&offset=0&limit=50&type=track`;
                rs(options)
                    .then((data) => {
                        var preview_url = undefined;
                        if (!!data && !!data.tracks && !!data.tracks.items) {
                            data.tracks.items.forEach((item) => {
                                item.artists.forEach((artist_name) => {
                                    var current_name = artist_name.name.toLowerCase().trim();
                                    var playing_name = artist.toLowerCase().trim();
                                    if (current_name.substring(0, 3) === "the") {
                                        current_name = current_name.substring(3).trim();
                                    }
                                    if (playing_name.substring(0, 3) === "the") {
                                        playing_name = playing_name.substring(3).trim();
                                    }
                                    if (current_name === playing_name) {
                                        preview_url = item.preview_url;
                                        trackId = item.id;
                                    }

                                });
                            });
                            options = {
                                uri: `https://api.spotify.com/v1/audio-features/${trackId}`,
                                json: true,
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            }
                            rs(options)
                                .then((data) => {
                                    energy = data.energy;
                                    valence = data.valence;
                                    resolve({
                                        "preview_url": preview_url,
                                        "energy": energy,
                                        "valence": valence
                                    });
                                })
                                .catch((error) => {
                                    resolve({
                                        "preview_url": preview_url,
                                        "energy": energy,
                                        "valence": valence
                                    });
                                })
                        } else {
                            reject('NO_PREVIEW_FROM_SPOTIFY');
                        }
                    })
            } else {
                reject('NO_MUSIC');
            }
        })
    },
    newUser: (info) => {
        return new Promise((resolve, reject) => {
            mongo.getInstance((db) => {
                db.collection('users')
                    .find({
                        username: info.user
                    })
                    .count()
                    .then((c) => {
                        if (c > 0) {
                            reject('USER_EXISTS');
                        } else {
                            db.collection('users').insertOne({
                                token: info.key,
                                name: '',
                                username: info.user,
                                mac_address: '',
                                last_song: '',
                                last_mood: ''
                            }, (err, r) => {
                                if (!err) {
                                    resolve(r);
                                } else {
                                    reject(err);
                                }
                            });
                        }
                    })
            })
        });
    },
    updateUserInfo: (who, what) => {
        return new Promise((resolve, reject) => {
            mongo.getInstance((db) => {
                db.collection('users')
                    .updateOne(
                        who, {
                            $set: what
                        }, (err, results) => {
                            if (!err) {
                                resolve(results);
                            } else {
                                reject(err);
                            }
                        })
            });
        });
    },
    logger: (string) => {
        if (string) {
            console.log(string);
            return true;
        } else {
            return false;
        }
    }
}
