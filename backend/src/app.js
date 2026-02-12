import express from 'express'

const app=express()


app.get('/',(req,res)=>{
    res.send("Uber clone started")
})

export default app