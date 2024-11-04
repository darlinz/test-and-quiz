const { Subject } = require('../models');
const generateCRUDControllers = require('./generateCRUDControllers');
const subjectCRUDControllers = generateCRUDControllers(Subject);
// Добавление новых методов
const subjectController = {
    ...subjectCRUDControllers, // Включаем все стандартные CRUD операции
    findSubjectByName: async (req, res) => {
        try {
            const subjects = await Subject.findAll({
                where: {
                    name: req.params.name
                }
            });
            res.status(200).json(subjects);
        } catch (error) {
            res.status(500).json(error);
        }
    }

};
module.exports = subjectController;
