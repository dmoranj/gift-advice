var utils = require("../services/routeUtils")
var users = require("../services/usersService")

exports.showLogin = function(req, res){
    res.render(utils.select(req, 'login'), {  });
};

exports.login = function(req, res) {
    users.authenticate(req.body.login, req.body.password, function(err, doc) {
        if (err || !doc) {
            utils.select(res, req, 'login', {
                status: "ERROR",
                errorMessage: "Wrong user or password"
            });
        } else {
            req.session.user = req.body.login;
            res.redirect('/home');
        }
    });
}

exports.showRegister = function(req, res) {
    utils.select(res, req, 'register', {
        name            : "",
        email           : "",
        surname         : "",
        nickname        : ""
    });
}

exports.register = function(req, res) {
    users.save(req.body, function(err){
        if (err) {
            utils.select(res, req, 'registrationResult', {
                status: "ERROR",
                errorMessage: err
            }, 500);
        } else {
            utils.select(res, req, 'registrationResult', {
                status: "OK",
                infoMessage: "User successfully created"
            });
        }
    });
}

exports.showUser = function(req, res) {
    users.find(req.params.userId, function(err, user) {
        if (user==null) {
            utils.select(res, req, 'register', {
                status          : "ERROR",
                errorMessage    : "User not found"
            });
        } else {
            utils.select(res, req, 'register', {
                name            : user.name,
                email           : user.email,
                surname         : user.surname,
                nickname        : user.nickname,
                status          : "OK"
            });
        }
    });
}

exports.delete = function (req, res) {
    users.delete(req.params.userId, function(err, user) {
        if (err) {
            utils.select(res, req, 'taskResult', {
                status: "ERROR",
                errorMessage: err
            });
        } else {
            utils.select(res, req, 'taskResult', {
                status: "OK",
                infoMessage: "User successfully created"
            });
        }
    })
}

exports.logout = function(req, res) {
    delete req.session.user;

    res.redirect('/users/login');
}

exports.list = function(req, res) {
    users.getList(function (err, list) {
        if (err) {
            utils.select(res, req, 'userList', {
                status: "ERROR",
                errorMessage: err
            });
        } else {
            utils.select(res, req, 'userList', {
                status: "OK",
                users: list
            });
        }
    });
}