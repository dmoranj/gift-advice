var utils = require("../services/routeUtils")

exports.show = function(req, res){
  res.render(utils.select(req, 'home'), { });
};

