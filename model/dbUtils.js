var
    user = require('./user'),
    request = require('./request'),
    advice = require("./advice"),
    notification = require("./notification"),
    async = require("async"),
    mongoose = require('mongoose');

var
    dbName = "gift-advice${suffix}",
    dbUrl  = "localhost";

switch (process.env.NODE_ENV) {
    case 'development':
        dbName = dbName.replace("${suffix}", "-dev");
        break;
    case 'testing':
        dbName = dbName.replace("${suffix}", "-test");
        break
    default:
        dbName = dbName.replace("${suffix}", "-test");
        break;
}

mongoose.connect('mongodb://' + dbUrl + '/' + dbName);

exports.mongoose = mongoose;

function deleteTable(entity, callback) {
    mongoose.model(entity).find({}, function(err, entities) {
        var deleteFunc = function(entity, mapCallback) {
            mapCallback(null, function(internalCallback) {
                entity.remove(internalCallback);
            });
        };

        async.map(entities, deleteFunc, function(err, notifyingFns) {
            async.parallel(notifyingFns, callback);
        });
    });
};

exports.cleanDb = function(globalCallback) {

    var genDeleteFn = function (entityName, mapCallback) {
        deleteTable(entityName, function(err) {
            mapCallback(null, err);
        });
    }

    async.map(["Notification", "User", "Advice", "Request"], genDeleteFn, function(err, removalFns) {
        if (globalCallback)
            globalCallback();
    });
}
