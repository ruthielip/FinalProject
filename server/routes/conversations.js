const router = require('express').Router();
const Conversation = require('../models/Conversation');

router.post('/messages', async (req, res)=>{
  const newConversation = new Conversation({
    members:[req.body.senderId, req.body.receiverId]
  });

  try{
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch(err) {
    res.status(500).json(err)
  }
})

router.post('/', async (req, res)=>{
  const conversation = new Conversation(req.body);
  try{
    const savedConvo = await conversation.save();
    res.status(200).json(savedConvo);
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

router.get('/:userId', async (req, res)=>{
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] }
    });
    res.status(200).json(conversation)
  } catch(err) {
    res.status(500).json(err)
  }
})

module.exports = router;
