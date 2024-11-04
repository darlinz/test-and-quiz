const { Quiz, Subject, Question, Answer, Result, User } = require('../models');
const { Op , fn, col} = require('sequelize');
const generateCRUDControllers = require('./generateCRUDControllers');

const quizCRUDControllers = generateCRUDControllers(Quiz);
// Добавление новых методов
const quizController = {
    ...quizCRUDControllers, 
    findQuizByName: async (req, res) => {
        try {
            const { name } = req.params; // Получаем название викторины из параметров запроса
            
            // Ищем викторины по названию, включая вопросы и ответы
            const quizzes = await Quiz.findAll({
                where: {
                    name: {
                        [Op.like]: `%${name}%`  // Ищем викторины по частичному совпадению названия
                    }
                },
                include: [
                    {
                        model: Question,  // Включаем вопросы
                        as: 'questions',
                        attributes: {exclude: ['quiz_id']},
                        include: [
                            {
                                model: Answer,  // Включаем ответы на каждый вопрос
                                as: 'answers',
                                attributes: { exclude: ['is_correct', 'question_id']}
                            },
                        

                        ]
                    }
                ]
            });
    
            // Если викторины найдены, возвращаем их
            res.status(200).json(quizzes);
        } catch (error) {
            console.error(error);  // Логируем ошибку
            res.status(500).json({ error: 'Ошибка при поиске викторины' });
        }
    },    

    findQuizBySubject: async (req, res) => {
        try {
            const { subjectName } = req.params; // Получаем название предмета из параметров запроса
    
            // Проверка, что параметр subjectName существует
            if (!subjectName) {
                return res.status(400).json({ error: 'Необходимо указать название предмета.' });
            }
    
            // Находим предмет по названию
            const subject = await Subject.findOne({
                where: { name: subjectName }
            });
    
            // Проверяем, найден ли предмет
            if (!subject) {
                return res.status(404).json({ error: 'Предмет не найден' });
            }
    
            // Ищем викторины по subject_id, включая вопросы и ответы
            const quizzes = await Quiz.findAll({
                where: {
                    subject_id: subject.id  // Используем найденный subject_id
                },
                include: [
                    {
                        model: Question,  // Включаем вопросы
                        as: 'questions',
                        attributes: { exclude: ['quiz_id'] },
                    }
                ]
            });
    
            // Если викторины найдены, возвращаем их
            if (quizzes.length > 0) {
                return res.status(200).json(quizzes);
            } else {
                return res.status(404).json({ message: 'Викторины по данному предмету не найдены' });
            }
    
        } catch (error) {
            console.error(error);  // Логируем ошибку
            res.status(500).json({ error: 'Ошибка при поиске викторины' });
        }
    },
    
    findQuizByAuthor: async (req, res) => {
        try {
            const { username } = req.params; // Получаем имя пользователя из параметров запроса
    
            // Проверка, что параметр username существует
            if (!username) {
                return res.status(400).json({ error: 'Необходимо указать имя пользователя.' });
            }
    
            // Находим пользователя по имени
            const user = await User.findOne({
                where: { username }
            });
    
            // Проверяем, найден ли пользователь
            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }
    
            // Ищем викторины, созданные пользователем (по user_id)
            const quizzes = await Quiz.findAll({
                where: {
                    author_id: user.id  // Используем найденный user_id
                },
                include: [
                    {
                        model: Question,  // Включаем вопросы
                        as: 'questions',
                        attributes: { exclude: ['quiz_id'] },
                        
                    }
                ]
            });
    
            // Если викторины найдены, возвращаем их
            if (quizzes.length > 0) {
                return res.status(200).json(quizzes);
            } else {
                return res.status(404).json({ message: 'Викторины, созданные данным пользователем, не найдены' });
            }
    
        } catch (error) {
            console.error(error);  // Логируем ошибку
            res.status(500).json({ error: 'Ошибка при поиске викторин по автору' });
        }
    }
,    


    findQuizById: async (req, res) => {
        try {
            const {id} = req.params; // Получаем название викторины из параметров запроса
            
            // Ищем викторины по названию, включая вопросы и ответы
            const quizzes = await Quiz.findOne({
                where: {
                    id: id
                },
                include: [
                    {
                        model: Question,  // Включаем вопросы
                        as: 'questions',
                        attributes: {exclude: ['quiz_id']},
                        include: [
                            {
                                model: Answer,  // Включаем ответы на каждый вопрос
                                as: 'answers',
                                attributes: { exclude: ['is_correct', 'question_id']}

                            }
                        ]
                    }
                ]
            });
    
            // Если викторины найдены, возвращаем их
            res.status(200).json(quizzes);
        } catch (error) {
            console.error(error);  // Логируем ошибку
            res.status(500).json({ error: 'Ошибка при поиске викторины' });
        }
    },  

    findAllQuizzes: async (req, res) => {
        try { 
            const quizzes = await Quiz.findAll({
                attributes: [
                    'id', 
                    'name',  
                    'author_id',  
                    [fn('COUNT', col('questions.id')), 'questionCount']  // Подсчет количества вопросов
                ],
                include: [
                    {
                        model: Subject,  
                        as: 'subject',
                        attributes: ['name'],  
                    },
                    {
                        model: Question,
                        as: 'questions',
                        attributes: []  
                    }
                ],
                group: ['Quiz.id', 'Subject.name'], 
            });
    
            res.status(200).json(quizzes); 
        } catch (error) { 
            console.error(error);
            res.status(500).json(error); 
        } 
    }
    
,

    createQuizWithQuestions: async (req, res) => {
        try {
            const { name, subject, questions } = req.body;  // Получаем данные викторины
    
            const authorId = req.userId; // Получаем ID пользователя из токена
            console.log("Author ID:", authorId);
    
            const subjectRecord = await Subject.findOne({ where: { name: subject } });
            
            if (!subjectRecord) {
                return res.status(400).json({ error: 'Subject not found' });
            }
    
            const subjectId = subjectRecord.id; 
            console.log("Subject ID:", subjectId);
    
            // Создаем новую викторину
            const quiz = await Quiz.create({ 
                name, 
                subject_id: subjectId,  // Записываем ID предмета
                author_id: authorId  // ID автора
            });
    
            // Проходим по каждому вопросу и сохраняем их
            for (const questionData of questions) {
                const { text, answers } = questionData;
    
                const question = await Question.create({ text, quizId: quiz.id });
    
                for (const answerData of answers) {
                    await Answer.create({
                        text: answerData.text,
                        is_correct: answerData.is_correct,
                        question_id: question.id
                    });
                }
            }
    
            res.status(201).json({
                message: 'Quiz created successfully',
                quiz: {
                    id: quiz.id,
                    name: quiz.name,
                    subject: subjectRecord.name,
                    authorId: authorId
                }
            });
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create quiz' });
        }
    },
    
    updateQuiz: async (req, res) => {
        const quizId = req.params.id;  // Получаем ID викторины из параметров запроса
        const { name, subject, questions } = req.body;  // Получаем обновленные данные викторины

        try {
            // Находим викторину по ID
            const quiz = await Quiz.findByPk(quizId);
            if (!quiz) {
                return res.status(404).json({ error: 'Quiz not found' });
            }

            // Обновляем имя викторины
            if (name) {
                quiz.name = name;
            }

            // Находим ID предмета по его названию
            const subjectRecord = await Subject.findOne({ where: { name: subject } });
            if (subjectRecord) {
                quiz.subjectId = subjectRecord.id;  // Обновляем subjectId
            }

            await quiz.save();  // Сохраняем обновленную викторину

            // Если вопросы переданы, обновляем их
            if (questions && Array.isArray(questions)) {
                // Здесь можно реализовать логику для обновления/удаления/добавления вопросов
                for (const questionData of questions) {
                    const { id, text, answers } = questionData;

                    // Находим вопрос по ID и обновляем его
                    const question = await Question.findByPk(id);
                    if (question) {
                        question.text = text;  // Обновляем текст вопроса
                        await question.save();  // Сохраняем обновленный вопрос

                        // Обновляем ответы на вопрос
                        if (Array.isArray(answers)) {
                            for (const answerData of answers) {
                                const answer = await Answer.findByPk(answerData.id);
                                if (answer) {
                                    answer.text = answerData.text;  // Обновляем текст ответа
                                    answer.is_correct = answerData.is_correct;  // Обновляем правильность ответа
                                    await answer.save();  // Сохраняем обновленный ответ
                                }
                            }
                        }
                    }
                }
            }


            res.status(200).json({
                message: 'Quiz updated successfully',
                quiz: {
                    id: quiz.id,
                    name: quiz.name,
                    subject: subjectRecord ? subjectRecord.name : null,
                    userId: quiz.userId
                }
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update quiz' });
        }
    },

    
    submitQuiz: async (req, res) => {
        const { quizId, answers } = req.body;  // Получаем ID викторины и ответы пользователя
    
        try {
            // Получаем все вопросы и правильные ответы для данной викторины
            const questions = await Question.findAll({
                where: { quiz_id: quizId },
                include: [{
                    model: Answer,
                    as: 'answers',  // Указываем псевдоним
                    where: { is_correct: true },  // Только правильные ответы
                    attributes: ['id', 'text']  // Исключаем лишние поля, например, 'isCorrect'
                }]
            });
    
            // Логируем вопросы и ответы для проверки
            console.log('Полученные вопросы:', JSON.stringify(questions, null, 2));
    
            // Подсчитываем количество правильных ответов пользователя
            let correctAnswersCount = 0;
    
            questions.forEach(question => {
                // Логируем текущий вопрос
                console.log('Текущий вопрос:', question);
    
                // Находим ответ пользователя для данного вопроса
                const userAnswer = answers.find(answer => answer.questionId === question.id);
                console.log('Ответ пользователя:', userAnswer);
    
                // Проверяем, существует ли ответ пользователя и правильный ответ
                if (userAnswer && question.answers.length > 0) {
                    const correctAnswer = question.answers[0];  // Проверяем, что правильный ответ существует
                    console.log('Правильный ответ:', correctAnswer);
    
                    if (userAnswer.answerId === correctAnswer.id) {
                        correctAnswersCount++;  // Увеличиваем счетчик, если ответ правильный
                    }
                }
            });
    
            // Считаем процент правильных ответов
            const totalQuestions = questions.length;
            const percentage = (correctAnswersCount / totalQuestions) * 100;
    
            // Сохраняем результат в базе данных
            const result = await Result.create({
                user_id: req.userId,  // Берем ID пользователя из токена
                quiz_id: quizId,
                questionsRight: correctAnswersCount,
                passDateTime: new Date()
            });
    
            // Возвращаем результат пользователю
            res.status(200).json({
                message: 'Quiz completed successfully',
                correctAnswersCount,
                totalQuestions,
                percentage: percentage.toFixed(2),
                resultId: result.id  // ID результата для дальнейшего использования
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Ошибка при проверке ответов' });
        }
    }
};    
module.exports = quizController;
