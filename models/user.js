'use strict';

module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('User', {

        firstname : {
            type: DataTypes.STRING,
        },

        lastname : {
            type : DataTypes.STRING,
        },

        email : {
            type : DataTypes.STRING,
        },

        isVerified : {
            type : DataTypes.BOOLEAN,
            defaultValue : false,
        },

        password : {
            type : DataTypes.STRING,
        },

        biography : {
            type : DataTypes.STRING,
        },

        birthdate : {
            type : DataTypes.DATE,
        },

        postalCode : {
            type : DataTypes.STRING,
        },

        city : {
            type : DataTypes.STRING,   
        },

        avatar : {
            type : DataTypes.STRING,
        },
        
    }, {});

    User.associate = models => {
        User.hasMany(models.Movie, {foreignKey : 'userId'})
    }
    
    return User;
}
