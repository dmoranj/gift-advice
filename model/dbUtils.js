var
    user = require('./user'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/friendly-advice');

exports.mongoose = mongoose;