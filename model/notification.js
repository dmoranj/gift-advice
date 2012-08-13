var mongoose = require('mongoose');

var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var Notification = new Schema({
    _id : ObjectId,
    text: String,
    type: String,
    title: String,
    date: Date,
    guid: String,
    sender: String,
    receiver: String
});

mongoose.model("Notification", Notification);