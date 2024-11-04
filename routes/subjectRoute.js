module.exports = app =>{
    const subjects = require("../controllers/subjectController")
    const router = require("express").Router()


    //retrieve all subjects
    router.get("/", subjects.findAll)

    //find a subject by id
    router.get('/:id', subjects.findOne);

    //add a subject
    router.post('/', subjects.create);


    app.use('/api/subjects', router)
}