var url = require('url');

var thirdparty = require('../lib/thirdparty'),
    ioc = require('../lib/ioc').sharedInstance(),
    tools = require('../lib/tools');


module.exports = {
    login: (req, res) => {
        var authUrl = thirdparty.getLastFmApi().getAuthenticationUrl({
            'cb': req.protocol + '://' + req.get('host') + '/auth'
        });
        res.render('login.html', {
            title: 'Login Last.FM',
            url: authUrl
        });
    },
    auth: (req, res) => {
        var token = url.parse(req.url, true).query.token;
        var session = thirdparty.getLastfmNodeApi().session({
            token: token,
            handlers: {
                success: (session) => {
                    tools.newUser(session)
                        .then((result) => {
                            ioc.emit('new_user', result.ops[0].username);
                            res.redirect('/login');
                        }).catch((err) => {
                            console.log(err);
                            res.redirect('/login');
                        });
                },
                error: (err) => {
                    console.log(err);
                }
            }
        });
    }
};
