
function selectByType(res, req, route, data) {
    if (req.headers.accept && req.headers.accept.indexOf("json") > 0) {
        res.json(data);
    } else {
        res.render("html/" + route, data);
    }
}

exports.select = selectByType;