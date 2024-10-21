const db = require('./database'); 

require('../models');


db.sync({ force: true })