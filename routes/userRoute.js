module.exports = app =>{
    const users = require("../controllers/userController")
    const router = require("express").Router()
    const authJWT = require('../middleware/authJWT');


    
    //sign in as a user
    router.post("/signin", users.signin)

    //create a new user
    router.post("/signup", users.create)

    //retrieve all users
    router.get("/", users.findAll)

    //find a user by id
    router.get('/:id', users.findOne);

    //find a user by username
    router.get('/username/:username', users.findUsersByUsername);

    //редактировать ползователя
    //router.put('/:id',authJWT.verifyToken, authJWT.checkUserId, users.update);

    //удалить пользователя по ид
    //router.delete('/:id',authJWT.verifyToken, authJWT.checkUserId, users.delete);


    app.use('/api/users', router)
}