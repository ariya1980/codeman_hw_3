module.exports = function(sequelize,type){
    return sequelize.define('tweets',{
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tweet : {
            type: type.STRING
        },
        username: {
            type: type.STRING
        },
        createdAt: {
            type: type.DATE, 
            defaultValue: new Date()
        }
    })
}