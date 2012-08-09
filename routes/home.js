var utils = require("../services/routeUtils")

exports.show = function(req, res){
    utils.select(res, req, 'home', { });
};

