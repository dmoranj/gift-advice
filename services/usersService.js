var db = require("../model/dbUtils"),
    User = db.mongoose.model('User');

function saveUser(userData, callback) {
    var userToCreate = new User();

    if (!userData.nickname || userData.nickname == "" || !userData.password || userData.password == "") {
        callback("User nickname and password are mandatory", null);
    } else {
        for (var attribute in userData) {
            userToCreate[attribute] = userData[attribute];
        }

        User.findOne({nickname: userToCreate.nickname}, function(err, doc) {
            if (doc) {
                callback("A user exists with the same nickname", null);
            } else {
                userToCreate.save(callback);
            }
        })
    }
}

function findUser(userId, callback) {
    User.findOne({nickname: userId}, callback);
}

function authUser(userId, password, callback) {
    User.findOne({nickname: userId}, function(err, doc) {
        if (!err && doc && doc.password==password) {
            callback(null, doc);
        } else {
            callback(err, null);
        }
    });
}

function deleteUser(userId, callback) {
    User.findOne({nickname: userId}, function(err, user) {
        if (err) {
            callback(err, null);
        } else {
            user.remove(callback);
        }
    });
}

function getUserList(callback) {
    User.find({}, callback);
}

exports.save= saveUser;
exports.find= findUser;
exports.authenticate = authUser;
exports.delete = deleteUser;
exports.getList = getUserList;
