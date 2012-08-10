
var loginParams = {
    login: "dmoranj",
    password: "pipopipopi"
}

exports.opts = {
    launchApp: true
}

exports.loginOptions = {
    url:    "http://localhost:3000/users/login",
    method: "POST",
    json:   loginParams
}


