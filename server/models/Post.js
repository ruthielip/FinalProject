const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId:{
      type: String,
      required: true
    },
    img:{
      type: String
    },
    desc:{
      type: String,
      max:300
    },
    likes:{
      type: Array,
      default: []
    },
    comments:{
      type: [
        {
          id: String,
          text: String,
          timestamp: Number
        }
      ]
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
