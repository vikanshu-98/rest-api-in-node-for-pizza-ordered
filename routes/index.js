import express from 'express'
const router = express.Router()

import {loginController, productController, refreshController, registerController, userController} from '../controllers/'
import auth from '../middlewares/auth'
import Admin from '../middlewares/admin'
router.post('/register',registerController.register)
router.post('/login',loginController.login)
router.get('/me',auth,userController.me)
router.post('/refreshtoken',refreshController.refreshToken)
router.post('/logout',auth,loginController.logout)
router.post('/product',[auth,Admin],productController.store)
router.put('/product/:id',[auth,Admin],productController.updateProduct)
router.delete('/product/:id',[auth,Admin],productController.deleteProduct)
router.get('/allProduct',productController.getAllProduct)
router.post('/singleProduct',productController.getSingleProduct)

export default router