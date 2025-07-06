const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['admin','user'],
        default: 'user',
        required: true
    },
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
},{
    timestamps: true,
})

module.exports = mongoose.model('User', userSchema);

