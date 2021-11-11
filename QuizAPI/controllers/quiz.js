const Questions = require('../models/Quiz')
const Attemps = require('../models/Attemps')

const addQuizToSystem = async(req,res,next) => {
  try {
    var quiz = new Questions();
    var data = req.body;
    data.forEach(element => {
      const quiz = new Questions();
      quiz.answers = element.answers;
      quiz.text = element.text;
      quiz.correctAnswer= element.correctAnswer["$numberInt"];
      quiz.__v = element.__v.$numberInt["$numberInt"];
      quiz.save();

    });

    return res.status(200).json({ success: true, code: 200, message: 'InitialSuccessful'})
  } catch (error) {
      return next(error)
  }
}

 const postAttemp = async(req, res, next) => {
  try {
    const questions = await Questions.aggregate([{ $sample: { size: 10 } }])

    const attemps = new Attemps();
    attemps.questions = questions;
    attemps. completed = false;
    attemps.score = 0;
    attemps.startedAt = new Date();
    attemps.save(); 

    return res.status(200).json({questions:questions, completed: attemps.completed ,score:0,_id:attemps._id,startedAt:attemps.startedAt,__v:0 })
  } catch (error) {
      return next(error)
  }
}
const submitQuiz = async(req, res, next) => {
  const id = req.params.id;
  const foundData = await Attemps.findById(id).populate('questions');
  if(foundData == null){
    return res.status(400).json({ success: false, code: 400, message: 'Bad request' })
  }
  else if(foundData.completed){
    return res.status(400).json({ success: false, code: 400, message: 'The answer was sunmit before' })
  }
  else{
    const countScore = 0;
    var a = req.body.answers;
    for(var key in a){
      await foundData.questions.forEach(element => {
        if(element._id == key && element.correctAnswer == a[key]){
          countScore++;
        }
      });
    }

    foundData.completed = true;
    foundData.score = countScore;
    foundData.answers = a;
    await foundData.save();
    
    var text ="";
    if(countScore < 5){
      text = "Practice more to improve it :D";
    }else if(countScore < 7){
      text = "Good, keep up!";
    } else if(countScore < 9){
      text = "Well done!";
    }else{
      text = "Perfect!!";
    }

    var correctAnswers = {};
    await foundData.questions.forEach(element => {
      correctAnswers[element._id] = element.correctAnswer;
    });

    return res.status(200).json({questions: foundData.questions,completed:foundData.completed, correctAnswers,startedAt:foundData.startedAt, __v:foundData.__v,answers: foundData.answers,scoreText:text})

  }
  

  return res.status(200).json({ success: true, code: 201, message: '' })
}

module.exports = {
  addQuizToSystem,
  postAttemp,
  submitQuiz
}