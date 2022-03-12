const models = require('../models');
const jwtUtils = require('../utils/jwt-utils');
const bcrypt = require('bcryptjs');
const asyncLib  = require('async');

module.exports = {

    // USER REGISTER
    addMovie : function (req, res) {
    
        let headerAuth  = req.headers['authorization'];
        let id         = jwtUtils.getUserId(headerAuth);

        if (id < 0)
            return res.status(400).json({ 'error': 'wrong token' });

        // Params
        let title = req.body.title
        let description = req.body.description
        let release_date = req.body.release_date;
        let image = req.body.image

        console.log(req.body)
        // Verify required params 
        if (title == null || title.length < 1 || 
            description == null || description.length < 1 ||
            release_date == null  || release_date.length < 1 ||
            image == null || image.length < 1)
        {
            return res.status(400).json(`erreur : des paramètres sont manquants`)
        }

        // TODO verify pseudo length, mail regex, password :
  
        models.Movie
            .findOne({
                where: {title: title}
            })
            .then(movie => {
                if (!movie) 
                {
                    models.Movie
                        .create({
                            title,
                            description,
                            release_date,
                            image
                        })
                        .then(movie =>res.status(200).json(movie))
                        .catch(err => res.status(500).json(`erreur : Impossible de créer le film => ${err}`))
                } else 
                {
                  res.status(409).json(`erreur : Le film ${title} existe déjà` )
                }
            })
            .catch(err => res.status(500).json(`erreur : Impossible de vérifier si le film existe => ${err}` ))
        },
    
    getMovies : function (req, res) {
        // Getting auth header
        let headerAuth  = req.headers['authorization'];
        let id         = jwtUtils.getUserId(headerAuth);

        if (id < 0 || null)
            return res.status(400).json({ 'error': 'wrong token' });

        models.Movie
        .findAll()
        .then(movies =>res.status(200).json(movies))
        .catch(function(err) {
            res.status(500).json({ 'error': `Impossible de récupérer les films => ${err}` });
        });
    },

}
