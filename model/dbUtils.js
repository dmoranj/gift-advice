var
    user = require('./user'),
    adviceRequest = require('./request'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/friendly-advice');

exports.mongoose = mongoose;