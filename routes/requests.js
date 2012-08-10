var requests = require('../services/requestService'),
    utils = require('../services/routeUtils')


exports.create = function (req, res) {
    req.body.requester = req.params.requester;
    requests.save(req.body, function(err, request) {
        if (err) {
            utils.select(res, req, 'createdRequest', {
                status: "ERROR",
                errorMessage: "The request could not be created" + err
            });
        } else {
            utils.select(res, req, 'createdRequest', {
                status: "OK",
                infoMessage: "Request created",
                guid: request.guid
            });
        }
    });
}

exports.show = function (req, res) {
    requests.find(req.params.requestId, function(err, request) {
        if (err || request == null) {
            utils.select(res, req, 'requestEdition', {
                status: "ERROR",
                errorMessage: "The request could not be created" + err
            });
        } else {
            request.status = "OK";
            request.infoMessage = "Request created";
            utils.select(res, req, 'requestEdition', request);
        }
    });
}

exports.list = function (req, res) {
    requests.list(req.params.requester, function(err, requests) {
        if (err || requests == null) {
            utils.select(res, req, 'requestList', {
                status: "ERROR",
                errorMessage: "The request list could not be retrieved from db: " + err
            });
        } else {
            utils.select(res, req, 'requestList', {
                status:         "OK",
                infoMessage:    "Request list retrieved.",
                requests: requests
            });
        }
    });
}

exports.delete = function(req,res) {
    requests.delete(req.params.requestId, function(err, request) {
        if (err || requests == null) {
            utils.select(res, req, 'requestList', {
                status: "ERROR",
                errorMessage: "The request list could not be removed from db: " + err
            });
        } else {
            utils.select(res, req, 'requestList', {
                status:         "OK",
                infoMessage:    "Request deleted."
            });
        }
    })
}