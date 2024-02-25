import User from "../models/User.js";

const createService = (body) => User.create(body);

const findAllService = () =>
  User.find().populate("following").populate("followers");

const findByIdService = (id) =>
  User.findById(id).populate("following").populate("followers");

const updateService = (id, newUserData) =>
  User.findOneAndUpdate({ _id: id }, newUserData)
    .populate("following")
    .populate("followers");

const findByUserNameService = (userName) =>
  User.findOne({ userName: userName })
    .populate("following")
    .populate("followers");

const findUserByEmailOrUserName = async (email, userName) => {
  try {
    const user = await User.findOne({
      $or: [{ email: email }, { userName: userName }],
    });
    return user;
  } catch (error) {
    throw new Error("Error finding user");
  }
};

export default {
  createService,
  findAllService,
  findByIdService,
  updateService,
  findByUserNameService,
  findUserByEmailOrUserName,
};
