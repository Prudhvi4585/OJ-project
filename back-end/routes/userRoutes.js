const express = require('express');
const router = express.Router();
const { register,login } = require('../controllers/userController');


router.post('/register',register);


router.post('/login',login);


// router.post('/logout',(req,res)=>{
//     console.log(req.body);
//     res.send('Logged out');
// })




// for getting profile of user   better use    :id in url


// router.get('/profile/:id',(req,res)=>{
//     console.log(req.params.id);
//     res.send('Profile of user');
// })


module.exports = router;