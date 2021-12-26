const exp = require('express');
const mongoose = require('mongoose');
const env = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const conversationRoute = require('./routes/conversations');
const messageRoute = require('./routes/messages');
const path = require('path');

const app = exp();
env.config();

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}, ()=>{
  console.log('Connected to MongoDB')
});

app.use('/images', exp.static(path.join(__dirname, 'public/images')));

app.use(exp.json());
app.use(morgan('common'));

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, 'public/images')
  },
  filename: (req, file, cb)=>{
    cb(null, req.body.name)
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/messages', messageRoute);

app.use(exp.static(path.join(__dirname, "/client/build")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});

app.listen(process.env.PORT || 5000, ()=>{
  console.log("listening...")
})
