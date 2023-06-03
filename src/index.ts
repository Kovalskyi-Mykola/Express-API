import express from 'express'
import http from "http"
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import mongoose from 'mongoose'
import router from './router/index'

require('dotenv').config();

const app = express();


app.use(express.json())
app.use(bodyParser.urlencoded())
app.use(bodyParser.urlencoded({ extended: true }));


app.use(compression());
app.use(cookieParser());
const server = http.createServer(app)


server.listen(8080, () => {
    console.log("Server Running on http://localhost:8080/")
})

const MOGNOURL = `mongodb+srv://${process.env.MONGO_TABLE_NAME}:${process.env.MONGO_PASSWORD}@cluster0.ehn9kkb.mongodb.net/?retryWrites=true&w=majority`;

mongoose.Promise = Promise;
mongoose.connect(MOGNOURL)
mongoose.connection.on('error', (error: Error) => console.log(error))


app.use('/', router())