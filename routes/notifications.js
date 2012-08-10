var
    util = require('../services/routeUtils'),
    notifications = require('../services/notificationService');

exports.create = function(req, res) {
    notifications.create(req.params.requester, req.body, function(err, notification) {
        if (err || notification == null) {
            util.select(res, req, 'createNotification', {
                status: "ERROR",
                errorMessage: "Couldn't post the notification"
            })
        } else {
            util.select(res, req, 'createNotification', {
                status: 'OK',
                infoMessage: 'Notification created',
                guid: notification.guid,
                timestamp: notification.date
            })
        }
    })
}

exports.delete = function(req, res) {
    notifications.delete(req.params.notificationId, function(err, notification) {
        if (err) {
            util.select(res, req, 'removeNotification', {
                status: "ERROR",
                errorMessage: "Couldn't remove the notification"
            })
        } else {
            util.select(res, req, 'removeNotification', {
                status: 'OK',
                infoMessage: 'Notification removed',
            })
        }

    })
}