const express = require('express');
const app = express();
const cors = require('cors');
const userRouter = require('./routes/userRoutes');
const connectDB = require('./config/db');

const dotenv = require('dotenv');
dotenv.config();

connectDB()
app.use(express.json());
app.use(cors());

app.use('/api/v1/users',userRouter);

// app.use('/api/v1/problems',problemRouter);

// app.use('/api/v1/contests',contestRouter);

// app.use('/api/v1/submissions',submissionRouter);



app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.listen(process.env.PORT, () => {
    console.log('Server is running on port 3000');
});