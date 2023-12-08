const RouterUser = require('express')
const routerUser = RouterUser()
const userController = require('./../controllers/user/user.controller')
const authMiddleware = require('../middlevars/auth.middlevar')

routerUser.post('/signup', userController.signup)
routerUser.post('/signin',userController.signin)
routerUser.post('/addavatar',authMiddleware,userController.addAvatar)
routerUser.get('/auth',authMiddleware, userController.check)
routerUser.get('/getinfo',authMiddleware, userController.getUser)
routerUser.get('/refresh', userController.refresh)
routerUser.post('/setInfo',authMiddleware, userController.changeUser)
routerUser.get('/createpdf',authMiddleware, userController.createPdf)

module.exports = routerUser 