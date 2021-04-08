var mongo = require('../lib/mongo');

module.exports = {
    index: (req, res) => {
        mongo.getInstance((db) => {
            db.collection('users').find({}).toArray((err, items) => {
                if (!err) {
                    res.render('admin', {
                        title: 'Update User Fields Last.FM',
                        users: items
                    });
                } else {
                    console.log(err);
                }
            });
        });
    },
    update: (req, res) => {
        var name = req.body.name,
            mac_address = req.body.mac_address,
            username = req.body.username,
            index = req.body.index;

        tools.updateUserInfo({
            username: username
        }, {
            name: name,
            mac_address: mac_address,
            index: index
        }).then((results) => {
            res.redirect('/admin');
        }).catch((err) => {
            console.log(err);
            res.redirect('/admin');
        });
    }
};
