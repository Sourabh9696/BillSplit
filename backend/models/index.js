const dbConfig = require('../config/dbConfig.js');

const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        dialectOptions: {
            // useUTC: false, //for reading from database
            dateStrings: true,
            typeCast: true,
            timezone: "+05:30"
          },
          timezone: "+05:30", //for writing to database
        operatorsAliases: false,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle

        }
    }
)

sequelize.authenticate()
.then(() => {
    console.log('connected..')
})
.catch(err => {
    console.log('Error'+ err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.users = require('./userModel.js')(sequelize, DataTypes)

db.bills = require('./billModel.js')(sequelize, DataTypes)

db.billusers = require('./billUserModel.js')(sequelize, DataTypes)


db.sequelize.sync({ force: false })
.then(() => {
    console.log('yes re-sync done!')
})



db.users.hasMany(db.bills);
db.users.hasMany(db.billusers);
db.bills.hasMany(db.billusers);

module.exports = db
