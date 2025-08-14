const  mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    tags: [{
        type: String,
    }],
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    postdetailsid:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'PostDetails',
        required: false
    }
},{
    timestamps: true,
});

module.exports = mongoose.model('Post', postSchema);
