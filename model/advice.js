var mongoose = require('mongoose')

var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var Advice = new Schema({
    _id               : ObjectId,
    title             : String,
    text              : String,
    urls              : [String],
    usefulnes         : Number,
    requestGUID       : String,
    guid              : String,
    advisor           : String
});

mongoose.model("Advice", Advice);