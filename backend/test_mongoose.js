const mongoose = require('mongoose');
const env = require('./config/env');
mongoose.connect(env.MONGO_URI || 'mongodb://127.0.0.1:27017/insightshare').then(async () => {
    const SystemPostReaction = require('./models/user/SystemPostReaction');
    try {
        let pr = await SystemPostReaction.findOneAndUpdate(
            { systemPostId: 'test1234' },
            { $setOnInsert: { systemPostId: 'test1234' } },
            { upsert: true, new: true }
        );
        console.log('PR likedBy exists:', !!pr.likedBy, 'is array:', Array.isArray(pr.likedBy));
        if (pr.likedBy) {
            console.log('has some?', typeof pr.likedBy.some === 'function');
        }
    } catch(e) {
        console.error('ERROR:', e.message);
    }
    mongoose.disconnect();
});
