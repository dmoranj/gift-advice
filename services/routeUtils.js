function selectByType(req, route) {
    if (req.headers.accept.indexOf("json") > 0) {
        return "json/" + route;
    } else {
        return "html/" + route;
    }
}

exports.select = selectByType;