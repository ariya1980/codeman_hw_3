const Sequelize = require('sequelize')
const TweetsModel = require('./tweets')
const UsersModel = require('./users')
const sequelize = new Sequelize('postgres://localhost:5431/twitter')

const connect = async function(){
    try{
        //await sequelize.authenticate()
        await sequelize.sync({force: true})
        console.log('Connected to database')
    }catch(e){
        console.log('Can not connect to database')
    }
}

module.exports = {
    connect,
    Tweets : TweetsModel(sequelize,Sequelize),
    Users: UsersModel(sequelize,Sequelize)
}


  