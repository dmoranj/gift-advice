var db = require("../model/dbUtils");

function saveUser(userData, callback) {
    var User = db.mongoose.model('User');

    var userToCreate = new User();

    for (attribute in userData) {
        userToCreate[attribute] = userData[attribute];
    }

    userToCreate.save(callback);
}

function findUser(userId, callback) {
    var User = db.mongoose.model('User');

    User.findOne({nickname: userId}, callback);
}

function authUser(userId, password, callback) {
    var User = db.mongoose.model('User');

    User.findOne({nickname: userId}, function(err, doc) {
        if (!err && doc && doc.password==password) {
            callback(null, doc);
        } else {
            callback(err, null);
        }
    });
}

exports.save= saveUser;
exports.find= findUser;
exports.authenticate = authUser;