var requests = require('../services/requestService'),
    utils = require('../services/routeUtils')


function createRequest(req, res) {
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

function showRequest(req, res) {
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

exports.create = createRequest;
exports.show = showRequest;