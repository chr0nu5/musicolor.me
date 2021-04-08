var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var LastFmNode = require('lastfm').LastFmNode;
var tools = require('./lib/tools');
var Moods = require('./lib/moods');
var mongo = require('./lib/mongo').initPool();

app.get('/', (req, res) => {
    res.sendfile('views/socket.html');
});

var processList = {};
processing = {};

var Moods = new Moods();

var lastfm = new LastFmNode({
        api_key: tools.lastFmApiKey,
        secret: tools.lastFmApiSecret
    }),
    main_index = -1,
    harper, total, duration;

var ProcessUser = function(user, index, track, harper, mood) {

    this.user = user;
    this.index = index;
    this.beats = tools.beatsPerSecond;
    this.track = track;
    this.harper = harper;
    this.socket = io;
    this.interval = undefined;
    this.mood = mood;
    this.playing = false;

    var _this = this;
    _this.socket.emit('finish', {
        u: user
    });
    this._init = () => {
        var date = new Date().toJSON();
        console.log(date.slice(0, 10), date.slice(11, 23), '\x1b[33m', `${this.user}: INIT (${_this.track.artist['#text']} - ${_this.track.name})`, '\x1b[0m');
        var mood = Moods.NearestFeeling(_this.mood);
        //send a change color to the queue
        _this.socket.emit('queue', {
            c: mood.colorIndex,
            i: _this.index,
            p: 0
        })
        _this.repeat = function() {
            if (_this.harper.length > 0 && _this.playing) {
                var eq = _this.harper[0],
                    percent = (100 * eq / 1000).toFixed(0),
                    buffer = '';
                _this.harper.shift();
                _this.socket.emit('harper', {
                    "user": _this.user,
                    "beat": percent,
                    "color": Moods.NearestFeeling(_this.mood).color
                });
                _this.socket.emit('queue', {
                    a: percent,
                    i: _this.index,
                    p: 0,
                    u: user
                });
                _this.interval = setTimeout(_this.repeat, 1000 / _this.beats);
                _this.playing = true;
            } else {
                clearTimeout(_this.interval);
                _this.playing = false;
            }
        }
        _this.interval = setTimeout(_this.repeat, 1000 / _this.beats);
    }
    this._finish = () => {
        _this.socket.emit('finish', {
            u: user
        });
        _this.playing = false;
        var date = new Date().toJSON();
        console.log(date.slice(0, 10), date.slice(11, 23), '\x1b[33m', `${this.user}: FINISH`, '\x1b[0m');
    }

}

function dumpError(err) {
    if (typeof err === 'object') {
        if (err.message) {
            console.log('\nMessage: ' + err.message);
        }
        if (err.stack) {
            console.log('\nStacktrace:');
            console.log('====================');
            console.log(err.stack);
            console.log('====================');
        }
    } else {
        console.log('dumpError :: argument is not an object');
    }
}

function stopUser(user, why) {
    if (user in processList) {
        if (processList[user].playing) {
            processList[user]._finish();
            //delete processList[user];
            io.emit('finish', {
                u: user
            });
        }
    }
    var date = new Date().toJSON();
    console.log(date.slice(0, 10), date.slice(11, 23), '\x1b[36m', `${user}: ${why}`, '\x1b[0m');
}

function initUser(user, track, main_index, harper, mood) {
    processList[user] = new ProcessUser(user, main_index, track, harper, {
        "energy": mood.energy,
        "valence": mood.valence
    });
    processList[user].playing = true;
    processList[user]._init();
}

function processTrack(track, user) {
    if (user in processList && processList[user].playing && track.name === processList[user].track.name) {
        var date = new Date().toJSON();
        console.log(date.slice(0, 10), date.slice(11, 23), user, ':\x1b[32m RUNNING (' + processList[user].track.name + ') \x1b[0m');
    } else {
        tools.processTrack(track, user)
            .then((info) => {
                harper = info.harper;
                total = harper.length;
                duration = info.duration;
                mood = {
                    "energy": info.energy,
                    "valence": info.valence
                }

                mongo.getInstance((db) => {
                    db.collection('users')
                        .findOne({
                            username: user
                        }, (err, item) => {
                            if (user in processList) {
                                if (processList[user].track.name !== track.name) {
                                    stopUser(user, 'NEW_SONG');
                                    initUser(user, track, processList[user].index, harper, mood);
                                } else {
                                    //we do not have to do anything, the song is playing
                                }
                            } else {
                                main_index += 1;
                                initUser(user, track, main_index, harper, mood);
                            }
                            return Promise.resolve();
                        });
                });

            })
            .catch((err) => {
                stopUser(user, '\033[31m' + err + '\x1b[0m');
            });
    }

}

function initNewUser(username) {
    var trackStream = lastfm.stream(username);
    trackStream.on('nowPlaying', processTrack)
        .on('error', function(error) {
            //dumpError(error);
            stopUser(username, error);
        })
        .on('lastPlayed', function(track) {
            stopUser(username, 'lastPlayed');
        })
        .on('stoppedPlaying', function(track) {
            stopUser(username, 'stoppedPlaying');
        });
    trackStream.start();
}

function initVisualization() {
    mongo.getInstance((db) => {
        db.collection('users')
            .find({})
            .forEach((element) => {
                initNewUser(element.username);
            });
    });
}

io.on('connection', (socket) => {
    socket.on('new_user', (username) => {
        initNewUser(username);
    })
});

http.listen(tools.socketPort);

initVisualization();
