const { Question } = require('../models');
const generateCRUDControllers = require('./generateCRUDControllers');
const questionCRUDControllers = generateCRUDControllers(Question);
// Добавление новых методов
const questionController = {
    ...questionCRUDControllers, // Включаем все стандартные CRUD операции
    findQuestionByQuizId: async (req, res) => {
        try {
            const questions = await Question.findAll({
                where: {
                    quiz_id: req.params.id
                }
            });
            res.status(200).json(questions);
        } catch (error) {
            res.status(500).json(error);
        }
    }

};
module.exports = questionController;
