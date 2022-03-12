'use strict';

module.exports = (sequelize, DataTypes) => {

    const Movie = sequelize.define('Movie', {

        title : {
            type: DataTypes.STRING,           
        },

        description : {
            type: DataTypes.STRING,           
        },
        
        release_date : {
            type : DataTypes.DATE,
        },

        image : {
            type : DataTypes.STRING,
        },

    }, {});

    Movie.associate = models => {
        Movie.belongsTo(models.User, {foreignKey : 'userId'})
    }
    
    return Movie;
}