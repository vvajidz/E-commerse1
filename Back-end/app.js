const userRouter = require('./routes/userRouter.js')
const express = require('express')
const app = express()
const env = require('dotenv').config()
const db = require('./config/db.js')
const { connect } = require('mongoose')
db()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api/user',userRouter)
app.use('/api/products',userRouter)

app.listen(process.env.PORT , () => {
    console.log('Server Runninggg');
    
}) 