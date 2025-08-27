// Write a Schemas for Profile and Chat Data only

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String, 
            required: true,
            trim: true,  //remove whitespaces in the beginning or end of schema
            unique: true,
            minlength: 3,
            maxlength: 30
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        photoUrl: {type: String, default: null},
        filePath:     { type: String, default: null }, // raw ImageKit path
        thumbnailUrl: { type: String, default: null }, 

        isActive:{
            type: Boolean,
            default: true
        },
        socketID: {
            type: String,
            index: true
        },
        status: {
            type: String,
            enum: ['Online' , 'Offline'],
            default: 'Offline'
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: function(doc, ret){
                delete ret.__v;
                return ret;
            }
        }
    }
);


UserSchema.index({ status: 1 });

module.exports = mongoose.model('User', UserSchema);