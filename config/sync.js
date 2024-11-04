const sequelize = require('./database'); // Импортируйте экземпляр Sequelize

// Убедитесь, что модели инициализированы
require('../models');

// Синхронизация базы данных (force: true сбрасывает и пересоздает таблицы каждый раз)
(async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synchronized and tables created.');
    } catch (error) {
        console.error('Error syncing the database:', error);
    } finally {
        await sequelize.close(); // Закрытие соединения
    }
})();
