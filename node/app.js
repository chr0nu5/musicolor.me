var express = require('express'),
    bodyParser = require('body-parser'),
    swig = require('swig'),
    consolidate = require('consolidate'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    SpotifyStrategy = require('passport-spotify').Strategy,
    config = require('./config.json');

// Controllers <3
var tokenController = require('./controllers/token_controller'),
    moodsController = require('./controllers/moods_controller'),
    adminController = require('./controllers/admin_controller'),
    musicController = require('./controllers/music_controller'),
    authController = require('./controllers/auth_controller');

var spotifyToken = '';

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(
    new SpotifyStrategy(
        {
            clientID: config.spotifyClientId,
            clientSecret: config.spotifyClientSecret,
            callbackURL: config.spotifyRedirectUri
        },
        function(accessToken, refreshToken, profile, done) {
            spotifyToken = accessToken;
            process.nextTick(function () {
                return done(null, profile);
            });
        }
    )
);

var ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

var app = express();
app
    .set('views', __dirname + '/views')
    .set('view engine', 'ejs')
    .use(bodyParser.urlencoded({
        extended: true
    }))
    .use(bodyParser.json())
    .use(cookieParser())
    .use(express.static(__dirname + '/public'))
    .engine('html', consolidate.swig)
    .use(methodOverride())
    .use(session({ secret: 'mm.me' }))
    .use(passport.initialize())
    .use(passport.session());


/* Routes */
app
    /* Token Controller */
    .get('/token', tokenController.token)
    .get('/refresh', tokenController.refresh)
    /* Moods Controller + Root */
    .get('/', ensureAuthenticated, (req, res) => {
        moodsController.index(req, res, spotifyToken);
    })
    .get('/login', moodsController.index)
    .get('/moods', moodsController.list)
    .get('/mood/:artist/:song/', moodsController.moodForSong)
    /* Admin Controller */
    .get('/admin', adminController.index)
    .post('/update', adminController.update)
    /* Auth Controller */
    .get('/login', authController.login)
    .get('/auth', authController.auth)
    /* Music Controller */
    .post('/get_song', (req, res) => {
        musicController.getSong(req, res, spotifyToken);
    })
    .get('/get_playlist/:mood', musicController.getPlaylistForMood)
    /* Login */
    .get('/auth/spotify', passport.authenticate('spotify'), (req, res) => { } )
    .get('/callback', passport.authenticate('spotify', { failureRedirect: '/login' }), (req, res) => { res.redirect('/'); })
    .get('/logout', (req, res) => { req.logout(); res.redirect('/'); });

// run app
app.listen(3000);
