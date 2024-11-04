const { User } = require('../models');
const generateCRUDControllers = require('./generateCRUDControllers');
const userCRUDControllers = generateCRUDControllers(User);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Добавление новых методов
const userController = {
    ...userCRUDControllers, 
    
    findUsersByUsername: async (req, res) => {
        try {
            const users = await User.findAll({
                where: {
                    username: req.params.username
                }
            });
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    signin: async (req, res) => {
        try {
            console.log(req.body); 
            const { username, password } = req.body;
            const user = await User.findOne({ where: { username } });
            if (!user) {
                return res.status(401).json({ error: "Invalid username or password" });
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid username or password" });
            }
            
            const token = jwt.sign({ userId: user.id }, process.env.SECRET_WORD, { expiresIn: '10m' });
            res.json({ message: "Authentication successful", token });

        } catch (error) {
            console.error(error);  // Логирование ошибки
            res.status(500).json({ error: "User login failed" });
        }
    }
    
    

}; 
module.exports = userController;
