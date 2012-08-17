var request = require("request"),
    assert = require("assert");

var loginParams = {
    login: "dmoranj",
    nickname: "dmoranj",
    password: "pipopipopi"
}

var alternateParams = {
    login: "gamera",
    nickname: "gamera",
    password: "popipopipo"
}

exports.opts = {
    launchApp: true
}

exports.loginOptions = {
    url:    "http://localhost:3000/users/login",
    method: "POST",
    json:   loginParams
}

exports.alternateLoginOptions = {
    url:    "http://localhost:3000/users/login",
    method: "POST",
    json:   alternateParams
}

exports.createUsers = function(callback) {
    var options = {
        url:    "http://localhost:3000/users/register",
        method: "POST",
        json:   loginParams
    }

    request(options, function(error, response, body) {
        assert.equal(body.status, "OK");
        loginParams.guid = body.guid;
        options.json = alternateParams;

        request(options, function(error, response, body) {
            assert.equal(body.status, "OK");
            alternateParams.guid = body.guid;
            callback();
        });
    });
}

exports.deleteUsers = function(callback) {
    var options = {
        method: "DELETE",
        json:   {}
    }

    options.url = "http://localhost:3000/users/" + loginParams.nickname;
    request(options, function(error, response, body) {
        assert.equal(body.status, "OK");
        options.url = "http://localhost:3000/users/" + alternateParams.nickname;
        request(options, function(error, response, body) {
            assert.equal(body.status, "OK");
            callback();
        });
    });
}



