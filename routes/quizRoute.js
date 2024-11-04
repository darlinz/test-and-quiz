module.exports = app =>{
    const quizzes = require("../controllers/quizController")
    const router = require("express").Router()
    const authJWT = require('../middleware/authJWT');


    //CRUD
    //create a new quiz
    router.post("/",  authJWT.verifyToken, quizzes.createQuizWithQuestions)

    //retrieve all guizzes
    router.get("/", quizzes.findAllQuizzes)

    //retrieve a quiz by id
    router.get("/id/:id", quizzes.findQuizById)

    //retrieve a quiz by name
    router.get("/name/:name", quizzes.findQuizByName)

    //retrieve a quiz by name
    router.get("/subject/:subjectName", quizzes.findQuizBySubject)

    //retrieve a quiz by author's username
    router.get('/author/:username', quizzes.findQuizByAuthor);

    //edit a quiz by id
    router.put('/id/:id', quizzes.updateQuiz);

    //delete a quiz by id
    router.delete('/:id', authJWT.verifyToken, authJWT.checkUserId, quizzes.delete);

    //submit a quiz
    router.post("/submit", authJWT.verifyToken, quizzes.submitQuiz)


    app.use('/api/quizzes', router)
}