const models = require('../models');
const jwtUtils = require('../utils/jwt-utils');
const bcrypt = require('bcryptjs');
const asyncLib  = require('async');

module.exports = {

    // USER REGISTER
    register : function (req, res) {
    
        // Params
        let firstname = req.body.firstname
        let lastname = req.body.lastname
        let email = req.body.email
        let password = req.body.password
        let birthdate = req.body.birthdate
        let city = req.body.city
        let postalCode = req.body.postalCode
        let biography = req.body.biography
        let avatar = req.body.avatar

        console.log(req.body)
        console.log(email)
        // Verify required params 
        if (email == null || lastname == null || password == null || firstname == null || city == null || postalCode == null ){
            return res.status(400).json(`erreur : des paramètres sont manquants`)
        }

        // TODO verify pseudo length, mail regex, password :
  
        models.User
            .findOne({
                where: { email: email}
            })
            .then(user => {
                if (!user) 
                {
                    bcrypt.hash(password, 10, (err, hash) => {
                    models.User
                        .create({
                            firstname : firstname,
                            lastname : lastname,
                            email : email,
                            password : hash,
                            birthdate : birthdate,
                            biography : biography,
                            postalCode : postalCode, 
                            city : city,
                            avatar: avatar,
                        })
                        .then(newUser =>res.status(200).json(newUser))
                        .catch(err => res.status(500).json(`erreur : Impossible de créer l'utilisateur => ${err}`))
                    })
                } else 
                {
                  res.status(409).json(`erreur : L'utilisateur avec l'adresse mail ${email} existe déjà` )
                }
            })
            .catch(err => res.status(500).json(`erreur : Impossible de vérifier l'utilisateur => ${err}` ))
        },
    
    // USER LOGIN
    login : function (req, res) {
        
        // Params
        let email = req.body.email
        let password = req.body.password

        if (email === '' ||  password === '') {
            return res.status(400).json({ 'error': 'Des paramètres sont manquants' });
        }

        // TODO verify pseudo length, mail regex, password :
        models.User
        .findOne({
            where: { email: email}
        })
        .then(userFound => {
            if (userFound) {
                bcrypt.compare(password, userFound.password, (errHash, resHash) => {
                if (resHash) {
                    res.status(200).json({
                    'ID' : userFound.id,
                    'token' : jwtUtils.generateTokenForUser(userFound)
                    })
                } else {
                    res.status(403).json({"error" : "Mot de passe incorrect"})
                }
                }) 
            } else {
                res.status(404).json({'error' : `L'utilisateur ${email} saisi n'existe pas`})
            }
        }) 
        .catch(err => {
            res.status(500).json({ 'error' : `Impossible de vérifier l'utilisateur => ${err}` })
        })
    },
    // MY PROFILE 
    getMyProfile : function (req, res) {
        // Getting auth header
        let headerAuth  = req.headers['authorization'];
        let id         = jwtUtils.getUserId(headerAuth);

        if (id < 0)
            return res.status(400).json({ 'error': 'wrong token' });

        models.User
        .findOne({
            attributes: [ 'id', 'email', 'firstname', 'lastname', 'biography', 'postalCode', 'city', 'birthdate', 'avatar' ],
            where: { id : id },
        })
        .then(function(user) {
            if (user) {
            res.status(201).json(user);
            } else {
            res.status(404).json({ 'error': `Utilisateur non trouvé` });
            }
        })
        .catch(function(err) {
            res.status(500).json({ 'error': `Impossible de récupérer les données de l'utilisateur => ${err}` });
        });
    },

    // Updating MY PROFILE 
    updateMyProfile : function (req, res) {
        // Getting auth header
        let headerAuth  = req.headers['authorization'];
        let ID = jwtUtils.getUserId(headerAuth)

        let firstname = req.body.firstname
        let lastname = req.body.lastname
        let password = req.body.password
        let birthdate = req.body.birthdate
        let avatar = req.body.avatar
        let city = req.body.city
        let postalCode = req.body.postalCode
        let biography = req.body.biography

            asyncLib.waterfall([
            function(done) {
                models.User.findOne({
                attributes: ['id','email', 'firstname', 'lastname', 'birthdate', 'avatar', 'city', 'postalCode', 'biography' ],
                where: { id: ID }
                }).then(function (userFound) {
                done(null, userFound);
                })
                .catch(function(err) {
                return res.status(500).json({ 'error': `Impossible de vérifier l'utilisateur` });
                });
            },
            function(userFound, done) {
                if(userFound) {
                userFound.update({
                    firstname: (firstname ? firstname : userFound.firstname), 
                    lastname: (lastname ? lastname : userFound.lastname),
                    avatar: (avatar ? avatar : userFound.avatar),
                    birthdate : (birthdate ? birthdate : userFound.birthdate),
                    city : (city ? city : userFound.city),
                    postalCode : (postalCode ? postalCode : userFound.postalCode),
                    biography : (biography ? biography : userFound.biography),
                }).then(function() {
                    done(userFound);
                }).catch(function(err) {
                    res.status(500).json({ 'error': `Impossible de mettre à jour l'utilisateur => ${err}` });
                });
                } else {
                res.status(404).json({ 'error': 'Utilisateur non trouvé' });
                }
            },
            ], function(userFound) {
            if (userFound) {
                return res.status(201).json(userFound);
            } else {
                return res.status(500).json({ 'error': `Impossible de mettre à jour les données de l'utilisateur` });
            }
        })
    },
}
