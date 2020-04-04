const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const PORT = 3000
const fileUpload = require("express-fileupload");
global.appRoot = __dirname;

app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }
  })
);
// database connected
mongoose.connect("mongodb://localhost/mynodeblog",
{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log("Database connected")
}).catch(err=>{
    console.log(err)
})

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


const routes = require('./server/routes/routes')
app.use("/api",routes)

app.use(morgan('dev'));
app.listen(PORT,()=>{
    console.log('Server Stated at Port ' + PORT)
})