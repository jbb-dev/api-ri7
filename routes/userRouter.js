const express = require('express');
const userRouter = express.Router();
const cors = require('cors');
const userController = require('../controller/userController');

userRouter.use(cors())

userRouter.post('/register', userController.register)
userRouter.post('/login', userController.login)
userRouter.get('/profile', userController.getMyProfile)
userRouter.put('/profile', userController.updateMyProfile)


module.exports = userRouter;