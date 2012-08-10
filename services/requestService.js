var
    db = require("../model/dbUtils"),
    utils = require("./dataUtils"),
    Request = db.mongoose.model('Request');


function saveRequest(requestData, callback) {

    var requestToCreate = new Request();

    if (!requestData.description || !requestData.advisors  ||
        requestData.description == "" || requestData.advisors.length == 0) {
        callback("Description and advisors are mandatory.", null);
    } else {
        for (var attribute in requestData) {
            requestToCreate[attribute] = requestData[attribute];
        }
        requestToCreate.guid = utils.getUUID();
        requestToCreate.save(callback);
    }
}

function findRequest(requestId, callback) {
    Request.findOne({guid: requestId}, callback);
}

function listRequests(requesterId, callback) {
    Request.find({requester: requesterId}, callback);
}

function deleteRequest(requestId, callback) {
    Request.findOne({guid: requestId}, function (err, request) {
        if (err || request == null) {
            callback(err, null);
        } else {
            request.remove(callback);
        }
    });
}

exports.save= saveRequest;
exports.find= findRequest;
exports.list= listRequests;
exports.delete= deleteRequest;
