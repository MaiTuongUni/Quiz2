const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Quiz = new Schema({
    answers: [{type:String}],
    text: {
        type:String
    },
    correctAnswer: {
        type:Number
    },
    __v:{
        type:Number
    }
});

const Questions = mongoose.model('Questions', Quiz)

module.exports = Questions