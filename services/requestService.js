var
    db = require("../model/dbUtils"),
    utils = require("./dataUtils"),
    notification = require("./notificationService"),
    async = require('async'),
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

        var notifyAdvisor = function(advisor, mapCallback) {
            mapCallback(null, function(callback) {
                var notificationData = {
                    sender: requestData.requester,
                    receiver: advisor,
                    type: "REQUEST",
                    title: "A new request for advice",
                    text: "A new request for advice from ${user} for ${user}"
                };
                notification.create(requestToCreate.requester, advisor, notificationData, function(err, not) {
                    callback(null, not);
                });
            });
        }

        async.map(requestToCreate.advisors, notifyAdvisor, function(err, notifyingFunctions) {
            async.parallel(notifyingFunctions, function(err, results) {
                requestToCreate.save(callback);
            });
        });
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
