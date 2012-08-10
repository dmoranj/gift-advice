
var loginParams = {
    login: "dmoranj",
    password: "pipopipopi"
}

var alternateParams = {
    login: "gamera",
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


