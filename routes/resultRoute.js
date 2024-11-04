module.exports = app =>{
    const results = require("../controllers/resultController")
    const router = require("express").Router()


    //retrieve all results (quiz history)
    router.get("/", results.findAll)

    //get results of a user by id
    router.get("/id/:id", results.findResultsByUserId)

    //get leaderboard
    router.get("/leaderboard", results.getLeaderboard)


    app.use('/api/results', router)
}