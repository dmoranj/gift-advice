var mongoose = require('mongoose');

var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var Request = new Schema({
    _id    : ObjectId
    , description     : String
    , advisors        : [String]
    , hobbieTags      : [String]
    , age             : Number
    , profession      : String
    , guid            : String
});

mongoose.model('Request', Request);