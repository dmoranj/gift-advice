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