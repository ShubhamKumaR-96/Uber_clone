import express, { urlencoded } from 'express'
import UserRouter from './routes/user.routes.js'
import cors from "cors";


const app=express()
app.use(cors())
app.use(express.json())

app.use(express.urlencoded({extended:true}))

app.use('/users',UserRouter)




export default app