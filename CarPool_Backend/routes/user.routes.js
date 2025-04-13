const express = require('express');
const userController = require('../controllers/user.controller.js');
const auth = require('../middlewares/auth.middleware.js');


const userRouter = express.Router();
const userControllerObj = new userController();

userRouter.post('/signup', (req, res, next)=>{
    userControllerObj.signUp(req, res, next);
})
userRouter.post('/signin', (req, res, next)=>{
    userControllerObj.signIn(req, res, next);
})
userRouter.get('/',auth, (req, res, next)=>{
    userControllerObj.findByUserId(req, res, next);
})
userRouter.put('/edit',auth, (req, res, next)=>{
    userControllerObj.updateUser(req, res, next);
})
userRouter.get('/delete/:id',auth, (req, res, next)=>{
    userControllerObj.removeUser(req, res, next);
})
module.exports = userRouter;