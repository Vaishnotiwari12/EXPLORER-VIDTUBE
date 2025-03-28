import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import {errorHandler} from './middlewares/error.middlewares.js';
import healthcheckRoutes from './routes/healthcheck.routes.js';
const app = express();

app.use(
    cors({
        origin:process.env.CORS_ORIGIN,
        credentials:true
    })
)
//common middleware 

app.use(express.json({limit:'16mb'}));
app.use(express.urlencoded({extended:true,limit:'16mb'}));
app.use(express.static('public'))

//import routes 
import healthcheckRouter from './routes/healthcheck.routes.js';

//use routes
app.use("/api/v1/healthcheck",healthcheckRouter);
app.use('/api', healthcheckRoutes);

export {app}
