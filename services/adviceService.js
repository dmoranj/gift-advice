var db = require('../model/dbUtils'),
    utils = require('../services/dataUtils');

var Advice = db.mongoose.model('Advice');
var Request = db.mongoose.model('Request');

exports.create = function(adviceToCreate, callback) {

    var advice = new Advice();

    for (var attribute in adviceToCreate) {
        advice[attribute] = adviceToCreate[attribute];
    }

    advice.guid = utils.getUUID();

    Request.findOne({guid: advice.requestGUID}, function (err, request) {
        if (err || request==null) {
            callback("Request not found", null);
        } else if (request.advisors.indexOf(advice.advisor) < 0) {
            callback("These request don't have the user as an advisor", null)
        } else {
            advice.save(callback)
        }
    });
}