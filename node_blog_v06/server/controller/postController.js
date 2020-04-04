const mongoose = require("mongoose");
const post = require("../model/post");
const Joi = require("@hapi/joi");

const getPosts = (req,res)=>{
    
  res.send("Get all Post ")
}
const getPost = (req,res)=>{
  res.send("Get Single Post")
}
const createPost = async (req, res) => {
  let data = req.body;
  let { title, body } = data;
  // for image
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: "Must Attach a file" });
  }
  // console.log(req.files);
  let files = req.files;
  console.log(files);

  if (files.myfiles.truncated === true) {
    return res.status(400).json({
      message: "File too large"
    });
  }
  if (
    !(
      files.myfiles.mimetype == "image/png" ||
      files.myfiles.mimetype == "image/jpeg"
    )
  ) {
    return res.status(400).json({
      message: "Only png and jpeg is allowed"
    });
  }

  files.myfiles.name = `${Date.now()}-${files.myfiles.name}`;
  let filepath = `${appRoot}/public/${files.myfiles.name}`;
  console.log(filepath);
  const schema = Joi.object({
    title: Joi.string()
      .min(4)
      .max(30)
      .required(),
    body: Joi.string()
      .min(5)
      .max(100)
      .required()
  });
  try {
    const validationErr = schema.validate(data, { abortEarly: false });
    if (validationErr && validationErr.error) {
      let message = validationErr.error.details.map(dat => {
        return dat.message;
      });
      return res.status(422).json({
        message
      });
    }
    files.myfiles.mv(filepath, function(err) {
      if (err) return res.status(500).send(err);
      console.log("File uploaded!");
    });
    data.createdAt = Date.now();
    data.imageUrl = files.myfiles.name;
    // localhost:8000/public/data.imageurl => while display in react
    let newPost = post(data);
    let result = await newPost.save(data);
    res.status(200).json({
      status: "Ok",
      newPost: result
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
const deletePost = (req,res)=>{
  res.send("deleted Post")
}
const updatePost = (req,res)=>{
  res.send("UpdatePost")
}

module.exports = {
  getPosts,
  getPost,
  createPost,
  deletePost,
  updatePost
};
