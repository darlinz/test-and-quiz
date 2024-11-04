const { DataTypes } = require('sequelize');
const db = require('../config/database'); 

const Answer = db.define('Answer', {
    text: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Answer cannot be empty',
            },
        }
    },
    is_correct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Mandatory field',
            },
        }
    }
}, {
    timestamps: false  
});

module.exports = Answer;