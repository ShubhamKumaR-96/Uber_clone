import express from 'express'
import {body} from 'express-validator'
import { registerUser } from '../controllers/user.controller.js'

const router=express.Router()

router.post('/register',[
    body('email').isEmail().withMessage("invalid email"),
    body('fullname.firstName').isLength({min:3}).withMessage("Firstname must be atleast 3 characters"),
    body('password').isLength({min:6}).withMessage("Password should be minmimum 6 length")
],registerUser)


export default router