'use strict';

module.exports = (sequelize, DataTypes) => {

    const Movie = sequelize.define('Movie', {

        title : {
            type: DataTypes.STRING,           
        },

        overwiew : {
            type: DataTypes.STRING,           
        },
        
        release_date : {
            type : DataTypes.DATE,
        },

        poster_path : {
            type : DataTypes.STRING,
        },

        isCustom : {
            type : DataTypes.BOOLEAN,
            defaultValue : true,
        },

    }, {});

    Movie.associate = models => {
        Movie.belongsTo(models.User, {foreignKey : 'userId'})
    }
    
    return Movie;
}