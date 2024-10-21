const Sequelize = require('sequelize');
const sequelize = require('../config/database'); 

const Quiz = require('./quizModel');
const Subject = require('./subjectModel');
const User = require('./userModel');
const Result = require('./resultModel');
const Question = require('./questionModel');
const Answer = require('./answerModel');


//Один ко многим между предметом и викторинами
Subject.hasMany(Quiz, {foreignKey: 'subject_id',  as: 'quizzes'});
Quiz.belongsTo(Subject, {foreignKey: 'subject_id',as: 'subject'});

//Один ко многим между вопросом и ответами
Question.hasMany(Answer, {foreignKey: 'question_id',  as: 'answers'});
Answer.belongsTo(Question, {foreignKey: 'question_id', as: 'question'});

//Один ко многим между викториной и вопросами
Quiz.hasMany(Question, {foreignKey: 'quiz_id',  as: 'questions'});
Question.belongsTo(Quiz, {foreignKey: 'quiz_id', as: 'quiz'});

//Один ко многим между викториной и автором(пользователем)
User.hasMany(Quiz, {foreignKey: 'author_id',  as: 'quizzes'});
Quiz.belongsTo(User, {foreignKey: 'author_id', as: 'user'});

//Один ко многим между викториной и результатами
Quiz.hasMany(Result, {foreignKey: 'quiz_id',  as: 'results'});
Result.belongsTo(Quiz, {foreignKey: 'quiz_id', as: 'quiz'});

//Один ко многим между пользователем и результатами
User.hasMany(Result, {foreignKey: 'user_id',  as: 'results'});
Result.belongsTo(User, {foreignKey: 'user_id', as: 'user'});

module.exports = {
    Quiz,
    User,
    Question,
    Answer,
    Result,
    Subject
};