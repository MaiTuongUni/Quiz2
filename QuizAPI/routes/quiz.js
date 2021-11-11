const router = require("express-promise-router")()

const quizController = require('../controllers/quiz')

router.route('/attemps').post(quizController.postAttemp)
router.route('/addQuiz').post(quizController.addQuizToSystem)
router.route('/attempts/:id/submit').post(quizController.submitQuiz)

module.exports = router 