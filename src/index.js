import dotenv from 'dotenv';
dotenv.config();
path:"./.env"

import {app} from './app.js';  
import { connectDB } from './db/index.js';



const PORT = 8001|| process.env.PORT;   

connectDB() //connecting to the database
.then(() =>  {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})

.catch((error) => {
    console.log("Server connection error",error);
})
