import upload from "../../config/multer.js";

const uploadSingle = async (req, res) => {
  console.log(req.file);
  res.json(req.file);
};

export { uploadSingle };
