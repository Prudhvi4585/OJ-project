const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const generateFile = require('./generateFile');
const executeCpp = require('./executeCpp');
dotenv.config();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.post("/run" , async (req,res)=>
{
    const {language = "cpp",code} = req.body;
    if(code === undefined)
    {
        return res.status(400).json({message: "Code is required"});
    }

    try{
            const filePath = generateFile(language,code);
            const output = await executeCpp(filePath);
            res.json({filePath,output});
    }
    catch(error)
    {
        res.status(500).json({message: error.message});
    }



} )




app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});