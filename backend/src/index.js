import app from "./app.js";
import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const PORT=process.env.PORT || 3000

app.use(cors())

http.createServer(app).listen(PORT,()=>{
    console.log(`Server started at port ${PORT}`)
})


