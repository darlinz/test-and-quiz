const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/database'); 

const Result = db.define('Result', {
    questionsRight: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    passDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    timestamps: false  
});

module.exports = Result;