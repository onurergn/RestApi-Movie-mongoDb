const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type:String,
        required: true,
        unique: true,
        maxlength: 60,
        minlength: 2
    },
    password: {
        type:String,
        maxlength: 60,
        minlength: 5
    }
});

module.exports = mongoose.model('user', UserSchema);