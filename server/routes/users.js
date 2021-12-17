const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/all', async(req, res)=>{
  try{
    const users = await User.find()
    res.status(200).json(users)
  } catch(err) {
    res.status(500).json(err)
  }
})

router.put('/:id', async (req, res)=>{
  if(req.body.userId === req.params.id || req.body.isAdmin){
     if(req.body.password){
       try{
         const salt = await bcrypt.genSalt(10);
         req.body.password = await bcrypt.hash(req.body.password, salt)
       } catch(err){
         return res.status(500).json(err);
       }
     }
     try{
       const user = await User.findByIdAndUpdate(req.params.id, {$set: req.body});
       res.status(200).json('Account has been updated')
     } catch(err){
       return res.status(500).json(err);
     }
  } else {
    return res.status(403).json('Wrong account')
  }
});

router.delete('/:id', async (req, res)=>{
  if(req.body.userId === req.params.id || req.body.isAdmin){
     try{
       await User.findByIdAndDelete(req.params.id);
       res.status(200).json('Account has been deleted')
     } catch(err){
       return res.status(500).json(err);
     }
  } else {
    return res.status(403).json('Wrong account')
  }
});

router.get('/', async (req, res)=>{
  const userId = req.query.userId;
  const username = req.query.username;
  try{
    const user = userId ? await User.findById(userId)
                        : await User.findOne({username: username}) ;
    const {password, updatedAt, ...other} = user._doc
    res.status(200).json(other)
  } catch(err){
    res.status(500).json(err);
  }
})

// get following:
router.get('/friends/:userId', async (req, res)=>{
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.following.map((friendId)=>{
        return User.findById(friendId)
      })
    );
    let friendList = [];
    friends.map((friend)=>{
      const {_id, username, profilePicture, desc} = friend;
      friendList.push({_id, username, profilePicture, desc})
    });
    res.status(200).json(friendList);
  }catch(err){
    res.status(500).json(err)
  }
})

// get followers
router.get('/followers/:userId', async (req, res)=>{
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followers.map((friendId)=>{
        return User.findById(friendId)
      })
    );
    let friendList = [];
    friends.map((friend)=>{
      const {_id, username, profilePicture, desc} = friend;
      friendList.push({_id, username, profilePicture, desc})
    });
    res.status(200).json(friendList);
  }catch(err){
    res.status(500).json(err)
  }
})

router.put('/:id/follow', async (req, res)=>{
  if(req.body.userId !== req.params.id){
    try{
       const user = await User.findById(req.params.id);
       const currentUser = await User.findById(req.body.userId);
       if(!user.followers.includes(req.body.userId)){
         await user.updateOne({$push: {followers: req.body.userId}});
         await currentUser.updateOne({$push: {following: req.params.id}});
         res.status(200).json('User has been added');
       }else {
         res.status(403).json('Already following this user')
       }
    }catch(err){
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('Cannot follow yourself')
  }
});

router.put('/:id/unfollow', async (req, res)=>{
  if(req.body.userId !== req.params.id){
    try{
       const user = await User.findById(req.params.id);
       const currentUser = await User.findById(req.body.userId);
       if(user.followers.includes(req.body.userId)){
         await user.updateOne({$pull: {followers: req.body.userId}});
         await currentUser.updateOne({$pull: {following: req.params.id}});
         res.status(200).json('You unfollowed this user');
       }else {
         res.status(403).json('You are not following this user')
       }
    }catch(err){
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('Cannot unfollow yourself')
  }
});

module.exports = router;