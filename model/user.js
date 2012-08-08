var mongoose = require('mongoose');

var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var User = new Schema({
    _id    : ObjectId
    , name     : String
    , email      : String
    , surname      : String
    , password      : String
    , nickname      : String
});

mongoose.model('User', User);