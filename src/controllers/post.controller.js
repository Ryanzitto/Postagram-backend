import {
  createService,
  findAllService,
  countPost,
  getByIdService,
  searchByUserService,
  updateService,
  deletePostService,
  likeService,
  likeDeleteService,
  addCommentService,
  removeCommentService,
} from "../services/post.service.js";

import User from "../models/User.js";

import Post from "../models/Post.js";

const create = async (req, res) => {
  try {
    const { subject, text, textColor, bgColor, textAlign } = req.body;

    if (!subject || !text || !textColor || !bgColor || !textAlign) {
      return res.status(400).send({
        message: "Submit all fields for registration",
      });
    }

    const posts = await createService({
      subject,
      text,
      textColor,
      bgColor,
      textAlign,
      user: req.userId,
    });

    res.status(201).send({ posts });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

const getAll = async (req, res) => {
  try {
    let { limit, offset } = req.query;

    if (!limit) {
      limit = 5;
    }
    if (!offset) {
      offset = 0;
    }

    limit = Number(limit);
    offset = Number(offset);

    const posts = await findAllService(limit, offset);

    const total = await countPost();

    const currentUrl = req.baseUrl;

    const next = offset + limit;

    const nextUrl =
      next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;

    const previousUrl =
      previous !== null
        ? `${currentUrl}?limit=${limit}&offset=${previous}`
        : null;

    if (posts.length === 0) {
      return res
        .status(404)
        .send({ message: "No posts found, how about creating the first one?" });
    }

    res.send({
      nextUrl,
      previousUrl,
      limit,
      offset,
      total,
      results: posts.map((item) => ({
        _id: item._id,
        subject: item.subject,
        text: item.text,
        textColor: item.textColor,
        bgColor: item.bgColor,
        textAlign: item.textAlign,
        likes: item.likes,
        comments: item.comments,
        createdAt: item.createdAt,
        user: {
          name: item.user.name,
          userName: item.user.userName,
          createdAt: item.createdAt,
        },
      })),
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === null || id === undefined) {
      return res
        .status(400)
        .send({ message: "Algo de errado não está certo com sua requisição" });
    }

    const posts = await getByIdService(id);

    if (!posts) {
      res.status(400).send({ message: "post not found" });
    }

    return res.send({
      posts: {
        _id: posts._id,
        subject: posts.subject,
        text: posts.text,
        textColor: posts.textColor,
        bgColor: posts.bgColor,
        textAlign: posts.textAlign,
        likes: posts.likes,
        comments: posts.comments,
        createdAt: posts.createdAt,
        user: {
          _id: posts.user._id,
          name: posts.user.name,
          userName: posts.user.userName,
          email: posts.user.email,
          __v: posts.user.__v,
          bio: posts.user.bio,
        },
      },
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const searchByUser = async (req, res) => {
  try {
    const id = req.userId;
    const posts = await searchByUserService(id);
    return res.send({
      results: posts.map((item) => ({
        id: item._id,
        subject: item.subject,
        text: item.text,
        textColor: item.textColor,
        bgColor: item.bgColor,
        textAlign: item.textAlign,
        likes: item.likes,
        comments: item.comments,
        name: item.user.name,
        userName: item.user.userName,
      })),
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const searchByUserName = async (req, res) => {
  try {
    const userName = req.params.userName;

    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const posts = await Post.find({ user: user._id })
      .sort({ _id: -1 })
      .populate("user");

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar Posts", error });
  }
};

const update = async (req, res) => {
  try {
    const { subject, text } = req.body;

    const { id } = req.params;

    console.log(id);
    if (!subject && !text) {
      return res.status(400).send({
        message: "Submit at least one field",
      });
    }

    const posts = await getByIdService(id);

    if (posts.user.id != req.userId) {
      return res.status(400).send({ message: "you did not update this post" });
    }

    await updateService(id, subject, text);

    return res.send({ message: "Post successfully updated" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const posts = await getByIdService(id);

    if (posts.user.id != req.userId) {
      return res.status(400).send({ message: "you did not delete this post" });
    }

    await deletePostService(id);

    return res.send({ message: "post deleted!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const like = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const postLiked = await likeService(id, userId);

  if (!postLiked) {
    await likeDeleteService(id, userId);
    return res.status(200).send({ message: "like removed" });
  }
  res.send({ message: "like successfull aplied" });
};

const comment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { comment, userName } = req.body;

    if (!comment) {
      return res.status(400).send({
        message: "write a comment to continue.",
      });
    }
    if (!userName) {
      return res.status(400).send({
        message: "send a userName to continue.",
      });
    }

    await addCommentService(id, comment, userId, userName);

    res.send({ message: "comment successfully completed" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const removeComment = async (req, res) => {
  try {
    const { id, idComment } = req.params;
    const userId = req.userId;

    const commentDeleted = await removeCommentService(id, idComment, userId);

    console.log(commentDeleted);

    const commentFinder = commentDeleted.comments.find(
      (comment) => comment.idComment === idComment
    );

    if (!commentFinder) {
      return res.status(400).send({ message: "comment not found" });
    }

    if (commentFinder.userId !== userId) {
      return res.status(400).send({ message: "this comment cant be deleted" });
    }

    res.send({ message: "comment successfully removed" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export {
  create,
  getAll,
  getById,
  searchByUser,
  searchByUserName,
  update,
  deletePost,
  like,
  comment,
  removeComment,
};
