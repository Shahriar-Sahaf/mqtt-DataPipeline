require('dotenv').config({path :require('path').resolve(__dirname,'../.env')});
const {createUser,getUserById} = require('../DB/pg')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


async function userLogin(req,res) {
    const { idNumber, password } = req.body;
    try {
        if (!idNumber || !password) {
        return res.status(400).json({ message: 'ID and password are required' });
      }
       let user = await getUserById(idNumber);
      if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUserId = await createUser(hashedPassword,idNumber);
        user = {id: newUserId, number: idNumber};
      }else{
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
      }
        const token = jwt.sign({userId : user.id},process.env.JWT_SECRET,{ expiresIn: '1h' })
        res.status(200).json({ message: 'Login successful', token });
        
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
    
}

module.exports = {userLogin}

