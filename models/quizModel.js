const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/database'); 

const Quiz = db.define('Quiz', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Quiz name cannot be empty',
            },
        }
    }

}, {
    timestamps: false  
});

module.exports = Quiz;