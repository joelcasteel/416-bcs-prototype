const mongoose= require('mongoose');
const MUUID = require("uuid-mongodb").mode('relaxed');

const RegSchema = new mongoose.Schema({
    _uuid: {
        type:'Object',
        unique: true,
        value: {type: 'Buffer'},
        default: () => MUUID.v4()
    },

    username: {
        type:   String,
        required: [true, 'Username required']
    },

    eventID: {
        type: String,
        required: [true, 'Event id required']
    },

    cardNumber: {
        type: Number,
        default: 0
    }
});

RegSchema.methods.toJSON = function() {
    return {
        "_uuid": MUUID.from(this._uuid).toString(),
        "username": this.username,
        "eventID": this.eventID,
    };
};

const RegModel = mongoose.model('Registration', RegSchema);
module.exports = RegModel;