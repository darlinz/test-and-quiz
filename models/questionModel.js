const { DataTypes } = require('sequelize');
const db = require('../config/database'); 

const Question = db.define('Question', {
    text: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Question cannot be empty',
            },
        }
    },
}, {
    timestamps: false  
});

module.exports = Question;