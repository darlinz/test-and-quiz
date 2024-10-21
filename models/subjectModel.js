const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/database'); 

const Subject = db.define('Subject', {
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Subject name cannot be empty',
            },
        }
    },
}, {
    timestamps: false  
});

module.exports = Subject;