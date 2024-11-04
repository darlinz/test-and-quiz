const { Result, Quiz, Question, User } = require('../models');  // Импортируем модели
const generateCRUDControllers = require('./generateCRUDControllers');
const resultCRUDControllers = generateCRUDControllers(Result);

const resultController = {
    ...resultCRUDControllers,

    // Метод для поиска результатов пользователя и расчета процента правильных ответов
    findResultsByUserId: async (req, res) => {
        try {
            // Ищем все результаты по user_id
            const results = await Result.findAll({
                where: {
                    user_id: req.params.id // Или используйте req.userId
                },
                include: [{
                    model: Quiz, 
                    as: "quiz", // Присоединяем информацию о викторине
                    attributes: ['id', 'name'],  // Включаем название викторины
                    include: [{
                        model: Question,
                        as: "questions",  // Присоединяем вопросы к викторине
                        attributes: ['id']  // Нам нужно только количество вопросов
                    }]
                }]
            });
    
            console.log('Полученные результаты:', JSON.stringify(results, null, 2)); // Логируем результаты
    
            // Проверка, что результаты были найдены
            if (!results.length) {
                return res.status(404).json({ message: 'No results found for this user.' });
            }
    
            // Рассчитываем процент правильных ответов и добавляем дату и название теста
            const resultsWithDetails = results.map(result => {
                // Здесь нужно проверить, есть ли quiz и questions
                if (!result.quiz || !result.quiz.questions) {
                    return {
                        quizName: result.quiz ? result.quiz.name : 'Unknown',
                        passDateTime: result.passDateTime,
                        percentage: 0,
                        questionsRight: result.questionsRight,
                        totalQuestions: 0
                    };
                }
    
                const totalQuestions = result.quiz.questions.length;  // Используем quiz.questions
                const percentage = (result.questionsRight / totalQuestions) * 100;
    
                return {
                    quizName: result.quiz.name,  // Используем quiz.name
                    passDateTime: result.passDateTime,
                    percentage: percentage.toFixed(2),
                    questionsRight: result.questionsRight,
                    totalQuestions: totalQuestions
                };
            });
    
            // Возвращаем результаты с дополнительными полями
            res.status(200).json(resultsWithDetails);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Ошибка при получении результатов' });
        }
    }
    
,    

getLeaderboard: async (req, res) => {
    try {
        // Получаем все результаты, присоединяя информацию о пользователе и викторине
        const results = await Result.findAll({
            include: [
                {
                    model: User,
                    as: "user", // Убедимся, что используем псевдоним
                    attributes: ['username'] // Выбираем только имя пользователя
                },
                {
                    model: Quiz,
                    as: "quiz", // Убедимся, что используем псевдоним
                    attributes: ['name'],
                    include: [{
                        model: Question,
                        as: "questions", // Убедимся, что используем псевдоним
                        attributes: ['id'], // Нам нужно только количество вопросов
                    }]
                }
            ]
        });

        // Проверяем, получены ли результаты
        if (!results.length) {
            return res.status(404).json({ message: 'Нет результатов для отображения.' });
        }

        // Рассчитываем процент правильных ответов для каждого результата
        const leaderboard = results.map(result => {
            // Проверяем, что user, quiz и его questions существуют
            if (result.user && result.quiz && result.quiz.questions) {
                const totalQuestions = result.quiz.questions.length || 1; // Защита от деления на 0
                const percentage = (result.questionsRight / totalQuestions) * 100;

                return {
                    username: result.user.username, // Имя пользователя
                    quizName: result.quiz.name, // Название викторины
                    percentage: percentage.toFixed(2), // Процент правильных ответов
                    questionsRight: result.questionsRight, // Количество правильных ответов
                    totalQuestions: totalQuestions, // Общее количество вопросов
                    passDateTime: result.passDateTime // Дата прохождения
                };
            } else {
                // Возвращаем null, если user, quiz или questions не существуют
                return null;
            }
        }).filter(entry => entry !== null); // Убираем пустые объекты, где user, quiz или questions не существует

        // Сортируем по проценту правильных ответов в порядке убывания
        leaderboard.sort((a, b) => b.percentage - a.percentage);

        // Добавляем место (номер участника) на основе индекса
        const leaderboardWithPosition = leaderboard.map((entry, index) => ({
            id: index + 1, // Место на доске лидеров (индекс + 1)
            ...entry
        }));

        // Возвращаем топ-10 пользователей с номерами мест
        res.status(200).json(leaderboardWithPosition.slice(0, 10)); // Например, топ-10
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при получении доски лидеров' });
    }
}

}

module.exports = resultController;
