const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

exports.register = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists!' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({
        name,
        email,
        password: hashedPassword });
    
    res.status(201).json({ message: 'User Registered Successfully', user });


}





exports.login = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'User not found!' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid Credentials!' });
  }

  const token = jwt.sign({user}, process.env.JWT_SECRET);
  res.status(200).json({
    message: 'Login Successful',
    token 
  });
}