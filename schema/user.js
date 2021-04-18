/**
 * user.js
 *  Definition for the BCS (SER416) user schema
 * 
 * @author Joel Casteel
 * @version April2021
 * @copyright Joel Casteel, April 2021 (MIT)
 * 
 */

const mongoose = require('mongoose');
const {roles} = require('../auth/role');

const UserSchema = new mongoose.Schema({
    username: {
        type:   String,
        unique: true,
        required: [true, 'Username required']
    },

    fullName: {
        type: String,
        default: ""
    },

    password: {
        type: String,
        required: [true, 'Password hash required']
    },

    role: {
        type: String,
        emum: [roles.User, roles.Admin],
        required: [true, 'User role required']
    },

    payment: {
        type: [{
            cardNum: String,
            name: String,
            expirMonth: Number,
            expirYear: Number,
        }],
        default: []
    }
});

UserSchema.methods.toJSON = function() {
    return {
        "username": this.username,
        "fullname": this.fullName,
        "role": this.role
    }
}

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;