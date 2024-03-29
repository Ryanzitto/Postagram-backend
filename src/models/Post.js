import mongoose from "mongoose";

const PostSchema = mongoose.Schema(
  {
    subject: {
      type: String,
      require: true,
    },
    text: {
      type: String,
      require: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    likes: {
      type: Array,
      require: true,
    },
    comments: {
      type: Array,
      require: true,
    },
    textColor: {
      type: String,
      reuire: true,
    },
    bgColor: {
      type: String,
      reuire: true,
    },
    textAlign: {
      type: String,
      reuire: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;
