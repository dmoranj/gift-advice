var db = require('../model/dbUtils'),
    notification = require('../services/notificationService'),
    utils = require('../services/dataUtils');

var Advice = db.mongoose.model('Advice');
var Request = db.mongoose.model('Request');

function createAdviceNotification(requester, advice, callback) {
    var notificationData = {
        sender: advice.advisor,
        receiver: requester,
        type: "ADVICE",
        title: "A new request for advice",
        text: "A new request for advice from ${user} for ${user}"
    };

    notification.create(advice.advisor, requester, notificationData, function(err, not) {
        callback(null, advice);
    });
}

exports.create = function(adviceToCreate, callback) {
    var advice = new Advice();

    for (var attribute in adviceToCreate) {
        advice[attribute] = adviceToCreate[attribute];
    }

    advice.guid = utils.getUUID();

    Request.findOne({guid: advice.requestGUID}, function (err, request) {
        if (err ||  request==null) {
            callback("Request not found for the given advice", null);
        } else if ( request.advisors.indexOf(advice.advisor) < 0) {
            callback("These request don't have the user as an advisor", null)
        } else {
            advice.save(function (err, savedAdvice) {
                createAdviceNotification(request.requester, savedAdvice, callback);
            });
        }
    });
}

exports.delete = function(adviceGuid, callback) {
    Advice.findOne({guid: adviceGuid}, function(err, advice) {
        if (err || advice==null) {
            callback("Error deleting or advice not found: " + err, null);
        } else {
            advice.remove(callback);
        }
    });
}

exports.find = function(adviceGuid, callback) {
    Advice.findOne({guid: adviceGuid}, callback);
}

exports.list = function(requestGuid, callback) {
    Advice.find({requestGUID: requestGuid}, callback);
}

exports.listByUser = function(userGuid, callback) {
    Advice.find({advisor: userGuid}, callback);
}
