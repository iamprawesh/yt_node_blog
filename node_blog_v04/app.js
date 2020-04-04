const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const PORT = 3000

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

const routes = require('./server/routes/routes')
app.use("/api",routes)

app.use(morgan('dev'));
app.listen(PORT,()=>{
    console.log('Server Stated at Port ' + PORT)
})