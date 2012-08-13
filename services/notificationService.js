var
    db = require('../model/dbUtils'),
    utils = require('../services/dataUtils'),
    Notification = db.mongoose.model("Notification");

exports.create = function (sender, notificationData, callback) {

    var notificationToCreate = new Notification();

    for (var attribute in notificationData) {
        notificationToCreate[attribute] = notificationData[attribute];
    }

    notificationToCreate.guid = utils.getUUID();
    notificationToCreate.sender = sender;
    notificationToCreate.date = new Date();
    notificationToCreate.save(callback);
}

exports.delete = function(notificationId, callback) {

    Notification.findOne({guid: notificationId}, function(err, notification) {
        if (err || notification== null) {
            callback("Couldn't find the notification", null);
        } else {
            notification.remove(callback);
        }
    });
}

exports.find = function(notificationId, callback) {
    Notification.findOne({guid: notificationId}, callback);
}