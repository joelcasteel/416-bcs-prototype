/**
 * event.js
 *  Definition for the BCS (SER416) event schema
 * 
 * @author Joel Casteel
 * @version April2021
 * @copyright Joel Casteel, April 2021 (MIT)
 * 
 */

const mongoose = require('mongoose');
const MUUID = require("uuid-mongodb").mode('relaxed');

const EventSchema = new mongoose.Schema ({
    _uuid: {
        type:'Object',
        unique: true,
        value: {type: 'Buffer'},
        default: () => MUUID.v4()
    },

    title: {
        type: String,
        required: [true, 'Event title required']
    },

    description: {
        type: String,
        default: ""
    },

    planner: {
        type: String,
        required:[true, "Planner name required"]
    },

    startDate: {
        type: Date,
        required: [true, 'Start date Required']
    },

    endDate: {
        type: Date,
        required: [true, 'End date required']
    },

    maxSlots: {
        type: Number,
        required: [true, 'Max participant slots requied']
    },

    cost: {
        type: Number,
        default: 0.0
    },

    count: {
        type: Number,
        default: 0
    },
        
    regs: {
        type: [{
            username: String,
            cardNum: String
        }],
        default: []
        }

});

EventSchema.methods.toJSON = function() {
    return {
        "_uuid": MUUID.from(this._uuid).toString(),
        "title": this.title,
        "description": this.description,
        "planner": this.planner,
        "startDate": this.startDate,
        "endDate": this.endDate,
        "maxSlots": this.maxSlots,
        "cost": this.cost,
        "regs": this.regs,
        "count": this.count
    };
};

var EventModel = mongoose.model('Event', EventSchema);

module.exports = EventModel;