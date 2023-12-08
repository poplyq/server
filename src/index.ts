import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import pathIndex from 'path';
import cookieParser from 'cookie-parser';

const sequelize = require('./db');
const router = require('./routes/index')

const PORT = process.env.PORT || 8765;
require('dotenv').config();
console.log(process.env.DB_PASSWORD,);

const app = express();


app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL,
}))
app.use(cookieParser(process.env.JWT_REFRESH_SECRET));
app.use(express.json())
app.use(express.static(pathIndex.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api',router)
const start = async () => {
  try {
   await sequelize.authenticate()
   await sequelize.sync()
    app.listen(PORT, () => {
      console.log(`Server starts at ${PORT} PORT`);
    });
  } catch (e){
    console.log(e);
  
  
  }
};
start()