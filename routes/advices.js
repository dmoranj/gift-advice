var
    util = require('../services/routeUtils'),
    advices = require('../services/adviceService');


exports.create = function (req, res) {
    var adviceToCreate = req.body;
    adviceToCreate.advisor = req.session.user;
    adviceToCreate.requestGUID = req.params.requestId

    advices.create(adviceToCreate, function(err, advice) {
        if (err) {
            util.select(res, req, 'createAdvice', {
                status: "ERROR",
                errorMessage: "Advice could not be created: " + err
            }, 500);
        } else {
            util.select(res, req, 'createAdvice', {
                status: "OK",
                infoMessage: "Advice created",
                guid: advice.guid
            });
        }
    });
}