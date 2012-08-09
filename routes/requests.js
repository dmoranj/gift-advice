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
                errorMessage: "Request created",
                guid: request.guid
            });
        }
    });
}

exports.create = createRequest;