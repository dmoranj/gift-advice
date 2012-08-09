var
    db = require("../model/dbUtils"),
    utils = require("./dataUtils");


function saveRequest(requestData, callback) {
    var Request = db.mongoose.model('Request');

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

exports.save= saveRequest;