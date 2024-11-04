const sequelize = require('../config/database'); // Правильный импорт экземпляра Sequelize
const { User, Answer, Question, Quiz, Result, Subject } = require('./models');
const data = require('./data/data.json');

(async () => {
    try {
        console.log("Importing data...");

        // Импорт пользователей
        for (const userData of data.users) {
            const user = await User.create(userData);
            console.log("User created:", user.toJSON());
        }
        for (const subjectData of data.subjects) {
            const subject = await Subject.create(subjectData);
            console.log("User created:", subject.toJSON());
        }

        // Импорт викторин
        for (const quizData of data.quizzes) {
            // Создание викторины
            const quiz = await Quiz.create({
                name: quizData.name,
                author_id: quizData.author_id
            });

            // Создание предмета, если он не существует
            const [subject, created] = await Subject.findOrCreate({
                where: { name: quizData.subject } // Используем subject как строку
            });

            // Связываем предмет с викториной
            await quiz.setSubject(subject);

            // Импорт вопросов
            for (const questionData of quizData.questions) {
                const question = await Question.create({
                    quiz_id: quiz.id,
                    text: questionData.text
                });

                for (const answerData of questionData.answers) {
                    await Answer.create({
                        question_id: question.id,
                        text: answerData.text,
                        is_correct: answerData.is_correct
                    });
                }
            }
            console.log("Quiz created:", quiz.toJSON());
        }

        // Импорт результатов
        for (const resultData of data.results) {
            const quizId = resultData.quizId;

            for (const userResult of resultData.results) {
                await Result.create({
                    quiz_id: quizId,
                    user_id: userResult.userId,
                    questionsRight: userResult.questionsRight,
                    passDateTime: userResult.passDateTime || new Date() // Используем текущую дату
                });
            }
            console.log(`Results imported for quiz ID: ${quizId}`);
        }

        console.log("Data successfully imported from JSON!");
    } catch (error) {
        console.error("Data import error:", error);
    }
})();
