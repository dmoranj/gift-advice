
function selectByType(res, req, route, data, code) {
    if (req.headers.accept && req.headers.accept.indexOf("json") > 0) {
        if (code) {
            res.json(code, data);
        } else {
            res.json(data);
        }

    } else {
        res.render("html/" + route, data);
    }
}

exports.select = selectByType;