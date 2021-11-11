const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Attemp = new Schema({
    questions: [{
        type: Schema.Types.ObjectId,
        ref: "Questions"
    }],
    completed: {
        type: Boolean
    },
    score:{
        type:Number
    },
    startedAt:{
        type: Date
    },
    __v:{
        type:Number,
        default: 0
    }, 
    answers: {
        type:Object
    }
});

const Attemps = mongoose.model('Attemps', Attemp)

module.exports = Attemps