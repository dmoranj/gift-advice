var
    user = require('./user'),
    request = require('./request'),
    advice = require("./advice"),
    notification = require("./notification"),
    mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/friendly-advice');

exports.mongoose = mongoose;