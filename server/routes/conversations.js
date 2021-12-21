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

router.delete('/:conversationId', async (req, res)=>{
  try{
    const conversation = await Conversation.findById(req.params.conversationId);
    await conversation.deleteOne()
    res.status(200).json('The conversation has been deleted')
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
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
