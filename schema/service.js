const mongoose= require('mongoose');
const MUUID = require("uuid-mongodb").mode('relaxed');

const ServiceSchema = new mongoose.Schema({
    _uuid: {
        type:'Object',
        unique: true,
        value: {type: 'Buffer'},
        default: () => MUUID.v4()
    },

    title: {
        type: String,
        required: [true, "Service title required"]
    },

    description: {
        type: String,
        default: ""
    },

    type: {
        type: String,
        enum: ['service', 'rental', 'care'],
        default: 'service'
    },

    cost: {
        type: Number,
        default: 0.0
    },

    costPeriod: {
        type: String,
        default: "One-Time"
    },

    regs: {
        type: [{
            username: String,
            cardNum: String,
            detail: String
        }],
        default: []
    }


});

ServiceSchema.methods.toJSON = function() {
    return {
        "_uuid": MUUID.from(this._uuid).toString(),
        "title": this.title,
        "description": this.description,
        "type": this.type,
        "cost": this.cost,
        "costPeriod": this.costPeriod,
        "regs": this.regs

    };

};

var ServiceModel = mongoose.model('Service', ServiceSchema);

module.exports = ServiceModel;