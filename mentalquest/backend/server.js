import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes/router.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express()

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    preflightContinue: false,
    optionSuccessStatus: 204,
    allowedHeaders: 'Content-Type, Authorization'
}

app.use(cors(corsOptions))

// use routes in router.js
app.use('/', router)

// connect to mongodb
const dbOptions = {useNewUrlParser: true, useUnifiedTopology: true}
mongoose.connect(process.env.DB_URI, dbOptions)
.then(() => console.log('Database Connected'))
.catch(err => console.log(err))

const port = process.env.PORT || 4000
const server = app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})