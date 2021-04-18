const mongoose= require('mongoose');
const MUUID = require("uuid-mongodb").mode('relaxed');

const ServiceRequestSchema = new mongoose.Schema({
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

    serviceID: {
        type: String,
        required: [true, 'Event id required']
    },

    cardNumber: {
        type: Number,
        default: 0
    }

});

ServiceRequestSchema.methods.toJSON = function() {
    return {
        "_uuid": MUUID.from(this._uuid).toString(),
        "username": this.username,
        "serviceID": this.eventID,
        "cardNumber": this.cardNumber
    };
}

const ServiceRequestModel = mongoose.model('ServiceRequest', ServiceRequestSchema);

module.exports = ServiceRequestModel;