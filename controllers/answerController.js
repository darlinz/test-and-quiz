const { Answer } = require('../models');
const generateCRUDControllers = require('./generateCRUDControllers');
const answerCRUDControllers = generateCRUDControllers(Answer);
// Добавление новых методов
const answerController = {
    ...answerCRUDControllers, // Включаем все стандартные CRUD операции
    findAnswersByQuestionId: async (req, res) => {
        try {
            const answers = await Answer.findAll({
                where: {
                    question_id: req.params.id
                }
            });
            res.status(200).json(answers);
        } catch (error) {
            res.status(500).json(error);
        }
    }

};
module.exports = answerController;
