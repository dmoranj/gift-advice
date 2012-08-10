var
    util = require('../services/routeUtils'),
    advices = require('../services/adviceService');


exports.create = function (req, res) {
    var adviceToCreate = req.body;
    adviceToCreate.advisor = req.session.user;
    adviceToCreate.requestGUID = req.params.requestId

    advices.create(adviceToCreate, function(err, advice) {
        if (err) {
            util.select(res, req, 'createAdvice', {
                status: "ERROR",
                errorMessage: "Advice could not be created: " + err
            }, 500);
        } else {
            util.select(res, req, 'createAdvice', {
                status: "OK",
                infoMessage: "Advice created",
                guid: advice.guid
            });
        }
    });
}

exports.delete = function(req, res) {
    advices.delete(req.params.adviceId, function(err, advice) {
        if (err) {
            util.select(res, req, 'removeAdvice', {
                status: "ERROR",
                errorMessage: "Advice could not be removed: " + err
            }, 500);
        } else {
            util.select(res, req, 'removeAdvice', {
                status: "OK",
                infoMessage: "Advice created"
            });
        }
    });
}

exports.show = function(req, res) {
    advices.find(req.params.adviceId, function(err, advice) {
        if (err || advice == null) {
            util.select(res, req, 'adviceEdition', {
                status: "ERROR",
                errorMessage: "Advice could not be found: " + err
            }, 404);
        } else {
            util.select(res, req, 'adviceEdition', {
                status: "OK",
                infoMessage: "Advice found",
                advice: advice
            });
        }
    });
}

function listAdvices(res, req) {
    return function (err, advices) {
        if (err) {
            util.select(res, req, 'adviceList', {
                status: "ERROR",
                errorMessage: "Advice list could not be retrieved: " + err
            }, 500);
        } else {
            util.select(res, req, 'adviceList', {
                status: "OK",
                infoMessage: "Advice list retrieved",
                advices: advices
            });
        }
    }
}

exports.list = function(req, res) {
    advices.list(req.params.requestId, listAdvices(res, req));
}

exports.listByUser = function(req, res) {
    advices.listByUser(req.params.requester, listAdvices(res, req));
}