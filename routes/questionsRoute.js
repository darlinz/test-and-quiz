module.exports = app =>{
    const questions = require("../controllers/questionController")
    const router = require("express").Router()
    const authJWT = require('../middleware/authJWT');


    //retrieve all questions
    router.get("/", questions.findAll)

    //find a question by question id
    router.get('/:id', questions.findOne);


    app.use('/api/questions', router)
}