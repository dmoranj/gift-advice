var
    util = require('../services/routeUtils'),
    notifications = require('../services/notificationService');

exports.create = function(req, res) {
    notifications.create(req.session.user, req.params.requester, req.body, function(err, notification) {
        if (err || notification == null) {
            util.select(res, req, 'createNotification', {
                status: "ERROR",
                errorMessage: "Couldn't post the notification"
            }, 500)
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
            }, 500)
        } else {
            util.select(res, req, 'removeNotification', {
                status: 'OK',
                infoMessage: 'Notification removed'
            })
        }

    })
}

exports.show = function(req, res) {
    notifications.find(req.params.notificationId, function(err, notification) {
        if (err) {
            util.select(res, req, 'notificationEdition', {
                status: "ERROR",
                errorMessage: "Couldn't find the notification " + req.params.notificationId
            }, 404)
        } else {
            util.select(res, req, 'notificationEdition', {
                status: 'OK',
                infoMessage: 'Notification found',
                notification: notification
            })
        }
    });
}

exports.list = function(req, res) {
    notifications.list(req.query.last, req.params.requester, function(err, notifications) {
        if (err) {
            util.select(res, req, 'notificationList', {
                status: "ERROR",
                errorMessage: "Couldn't retrieve notification list for " + req.params.requester
            }, 500)
        } else {
            util.select(res, req, 'notificationList', {
                status: 'OK',
                infoMessage: 'Notification list retrieved',
                notifications: notifications
            })
        }
    });
}