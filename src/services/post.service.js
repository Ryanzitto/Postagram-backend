import Post from "../models/Post.js";

const createService = (body) => Post.create(body);

const findAllService = (limit, offset) =>
  Post.find().sort({ _id: -1 }).skip(offset).limit(limit).populate("user");

const countPostService = (id) => Post.countDocuments({ user: id });

const countPost = () => Post.countDocuments();

const getByIdService = (id) => Post.findById(id).populate("user");

const searchByTitleService = (title) =>
  Post.find({
    title: { $regex: `${title || ""}`, $options: "i" },
  })
    .sort({ _id: -1 })
    .populate("user");

const searchByUserService = (id) =>
  Post.find({ user: id }).sort({ _id: -1 }).populate("user");

const updateService = (id, title, text, banner) =>
  Post.findOneAndUpdate(
    { _id: id },
    { title, text, banner },
    { includeResultMetadata: false }
  );

const deletePostService = (id) => Post.findOneAndDelete({ _id: id });

const likeService = (id, userId) =>
  Post.findOneAndUpdate(
    { _id: id, "likes.userId": { $nin: [userId] } },
    { $push: { likes: { userId, created: new Date() } } }
  );

const likeDeleteService = (id, userId) =>
  Post.findOneAndUpdate({ _id: id }, { $pull: { likes: { userId } } });

const addCommentService = (id, comment, userId, userName) => {
  const idComment = Math.floor(Date.now() * Math.random()).toString(36);
  return Post.findOneAndUpdate(
    { _id: id },
    {
      $push: {
        comments: {
          idComment,
          userId,
          comment,
          createdAt: new Date(),
          userName,
        },
      },
    }
  );
};

const removeCommentService = (id, idComment, userId) =>
  Post.findOneAndUpdate(
    { _id: id },
    { $pull: { comments: { idComment, userId } } }
  );

const searchByUserNameService = (userName) => User.findOne({ userName });

const findByUserUserId = (user) =>
  Post.find({ user: user._id }).sort({ _id: -1 }).populate("user");

const findByUserName = (userName) =>
  Post.findOne({ userName }).sort({ _id: -1 }).populate("user");

export {
  createService,
  findAllService,
  countPostService,
  getByIdService,
  searchByTitleService,
  searchByUserService,
  updateService,
  deletePostService,
  likeService,
  likeDeleteService,
  addCommentService,
  removeCommentService,
  searchByUserNameService,
  findByUserUserId,
  findByUserName,
  countPost,
};
