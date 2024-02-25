import userService from "../services/user.service.js";
import User from "../models/User.js";

const create = async (req, res) => {
  try {
    const { name, userName, email, password } = req.body;

    if (!name || !userName || !email || !password) {
      res.status(400).send({ message: "Submit all fields for registration" });
    }

    const existingUser = await userService.findUserByEmailOrUserName(
      email,
      userName
    );

    if (existingUser) {
      return res
        .status(400)
        .send({ message: "Email or userName already in use" });
    }

    const user = await userService.createService({
      name: name,
      userName: userName,
      email: email,
      password: password,
      avatar: "",
    });

    res.status(201).send({
      message: "User created successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const findAll = async (req, res) => {
  try {
    const users = await userService.findAllService();

    if (users.length === 0) {
      return res.status(400).send({ message: "there is no registred users" });
    }
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const findById = async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const findByUserName = async (req, res) => {
  try {
    const { userName } = req.params;

    if (!userName) {
      return res.status(400).send({ message: "username is missing" });
    }

    const user = await userService.findByUserNameService(userName);

    if (!user) {
      return res.status(404).send({ message: "userName not found" });
    }

    res.send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { name, userName, email, password, bio, avatar } = req.body;

    const id = req.params.id;

    if (!name && !userName && !email && !password && !bio && !avatar) {
      return res
        .status(400)
        .send({ message: "Submit at least one field for registration" });
    }

    const newUserData = req.body;

    const userUpdated = await userService.updateService(id, newUserData);

    res.status(200).send({ message: "User updated with sucess." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const followUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId;

    if (!id) {
      return res.status(400).send({
        message: "send the id of user that you want to follow to continue",
      });
    }

    if (!userId) {
      return res.status(400).send({
        message: "send the userId to continue",
      });
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: { following: id },
    });
    await User.findByIdAndUpdate(id, {
      $addToSet: { followers: userId },
    });

    res.status(200).send({ message: "Successfully followed the user." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const userIdToFollow = req.params.id;

    const userId = req.body.id;

    if (!userIdToFollow) {
      return res.status(400).send({
        message: "envie o id do usuario a se seguir!",
      });
    }
    if (!userId) {
      return res.status(400).send({
        message: "envie o id do usuario.",
      });
    }

    const achei = await userService.followService(userIdToFollow);

    return res.status(200).send({ message: `achei o usuario: ${achei}` });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

//Criar uma rota de deleção de usuario

export default {
  create,
  findAll,
  findById,
  update,
  findByUserName,
  followUser,
  unfollowUser,
};
