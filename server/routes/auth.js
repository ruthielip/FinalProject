const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res)=>{
   try{
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(req.body.password, salt);

     const newUser = new User({
       username: req.body.username,
       email: req.body.email,
       password: hashedPassword
     })

     const user = await newUser.save();
     res.status(200).json(user)
   } catch(err){
     res.status(500).json(err)
     console.log(err);
   }
});

router.post('/login', async (req, res)=>{
  try{
    const user = await User.findOne({ email:req.body.email });
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if(!user){
      res.status(404).send('user not found');
      return;
    } else if(!validPassword){
      res.status(400).json('wrong password');
      return;
    } else {
      res.status(200).json(user);
    }
    
  } catch(err){
    res.status(500).json(err)
  }
})

module.exports = router;
