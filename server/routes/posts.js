const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

router.get('/all', async(req, res)=>{
  try{
    const posts = await Post.find()
    res.status(200).json(posts)
  } catch(err) {
    res.status(500).json(err)
  }
})

router.post('/', async (req, res)=>{
  const newPost = new Post(req.body);
  try{
    const savedPost = await newPost.save();
    res.status(200).json(savedPost)
  }catch(err){
    res.status(500).json(err)
  }
});

router.put('/:id', async (req, res)=>{
  try{
    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
      await post.updateOne({$set: req.body});
      res.status(200).json('The post has been updated')
    } else {
      res.status(403).json('Cannot update this post')
    }
  } catch(err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res)=>{
  try{
    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
      await post.deleteOne();
      res.status(200).json('The post has been deleted')
    } else {
      res.status(403).json('Cannot delete this post')
    }
  } catch(err) {
    res.status(500).json(err);
  }
});

router.get('/likes/:id', async (req, res)=>{
  try{
     const post = await Post.findById(req.params.id);
     const likes = await Promise.all(
       post.likes.map((postId)=>{
         return User.findById(postId)
       })
     );
     let likesArray = [];
     likes.map((like)=>{
       const {_id, username, profilePicture, desc} = like;
       likesArray.push({_id, username, profilePicture, desc})
     })
     res.status(200).json(likesArray)
  } catch(err) {
    res.status(500).json(err)
  }
})

router.put('/:id/like', async (req, res)=>{
  try{
    const post = await Post.findById(req.params.id);
    if(!post.likes.includes(req.body.userId)){
      await post.updateOne({$push: {likes: req.body.userId}});
      res.status(200).json('The post has been liked')
    } else {
      await post.updateOne({$pull: {likes: req.body.userId}});
      res.status(200).json('Disliked post')
    }
  } catch(err) {
    res.status(500).json(err)
  }
});

router.put('/:id/comment', async (req, res)=>{
  try{
    const post = await Post.findById(req.params.id);
      await post.updateOne({$push: {comments:{
        id: req.body.userId,
        text: req.body.text,
        timestamp: new Date().getTime()
      }}});
      res.status(200).json('comment added');
  } catch(err) {
    res.status(500).json(err)
  }
});

router.put('/:id/comments', async (req, res)=>{
  try{
    const post = await Post.findById(req.params.id);
    await post.updateOne({$pull: {comments:{
      _id: req.body.commentId
    }}});
    res.status(200).json('comment deleted')
  } catch(err) {
    res.status(500).json(err);
  }
})

router.get('/:id', async (req, res)=>{
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post)
  } catch(err) {
    res.status(500).json(err)
  }
});

router.get('/timeline/:userId', async (req, res)=> {
  try{
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({userId: currentUser._id});
    const friendPosts = await Promise.all(
      currentUser.following.map(id=>{
        return Post.find({userId: id});
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts))
  } catch(err) {
    res.status(500).json(err)
  }
});

router.get('/profile/:username', async (req, res)=> {
  try{
    const user = await User.findOne({username: req.params.username})
    const posts = await Post.find({userId: user._id});
    res.status(200).json(posts)
  } catch(err) {
    res.status(500).json(err)
  }
});

module.exports = router;
