const  mongoose = require("mongoose");

const PostDetailsSchema = mongoose.Schema({
    like:{
        type: String,
        required: true,
        default: '0'
    },
    dislike:{
        type: String,
        required: true,
        default: '0'
    },
    comment:{
        type: String
    },
    status:{
        type: String,
        enum: ['public','private'],
        default: 'public',
        required: true
    },
    update:{
        type: String, 
    },
    delete:{
        type: Date,
        default: Date.now
    },
    postid:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required: true
    },
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
},{
    timestamps: true,
});

module.exports = mongoose.model('PostDetails', PostDetailsSchema);
