import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

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

const secret = process.env.ACCESS_TOKEN_SECRET;
if (!secret) {
    console.error("Error: ACCESS_TOKEN_SECRET is undefined.");
    process.exit(1); // Stop the app if it's missing
}


const token = jwt.sign(
  { foo: 'bar' },
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: '1h' }
);

console.log("Generated Token:", token);
















export {app}
