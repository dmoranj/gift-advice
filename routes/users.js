var utils = require("../services/routeUtils")
var users = require("../services/usersService")

exports.showLogin = function(req, res){
    res.render(utils.select(req, 'login'), {  });
};

exports.login = function(req, res) {
    users.authenticate(req.body.login, req.body.password, function(err, doc) {
        if (err) {
            res.render(utils.select(req, 'login'), {
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
    res.render(utils.select(req, 'register'), {
        name            : "",
        email           : "",
        surname         : "",
        nickname        : ""
    });
}

exports.register = function(req, res) {
    users.save(req.body, function(err){
        if (err) {
            res.render(utils.select(req, 'registrationResult'), {
                status: "ERROR",
                errorMessage: err
            });
        } else {
            res.render(utils.select(req, 'registrationResult'), {
                status: "OK",
                infoMessage: "User successfully created"
            });
        }
    });
}

exports.showUser = function(req, res) {
    users.find(req.params.userId, function(err, doc) {
        res.render(utils.select(req, 'register'), {
            name            : doc.name,
            email           : doc.email,
            surname         : doc.surname,
            nickname        : doc.nickname
        });
    });
}

exports.logout = function(req, res) {
    delete req.session.user;

    res.redirect('/users/login');
}