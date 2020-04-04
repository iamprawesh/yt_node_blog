const mongoose = require("mongoose");
const post = require("../model/post");
const user = require("../model/user");

const Joi = require("@hapi/joi");

const getPosts = async (req, res) => {
  try {
    let result = await post.find().populate({path:'createdBy',select:"name email",model:user}).sort({createdAt:-1});
    res.status(200).json({
      result: "ok",
      count:result.length,
      posts: result
    });
  } catch {
    res.status(500).json({
      message: err.message
    });
  }
};
const getUserPosts = async (req, res) => {
  let{id} = req.params
  try {
    let result = await post.find({createdBy:id}).populate({path:'createdBy',select:"name email",model:user}).sort({createdAt:-1});
    res.status(200).json({
      result: "ok",
      count:result.length,
      posts: result
    });
  } catch {
    res.status(500).json({
      message: err.message
    });
  }
};
const getPost = async (req, res) => {
  let { id } = req.params;
  try {
    let result = await post.findOne({ _id: id }).populate({path:'createdBy',select:"name email",model:user});
    res.status(200).json({
      status: "ok",
      count:result.count,
      posts: result
    });
  } catch {
    res.status(500).json({
      message: err.message
    });
  }
};
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
      .max(200)
      .required(),
    body: Joi.string()
      .min(5)
      .max(1000)
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
    data.createdBy = req.userData._id
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
const updatePost = async (req, res) => {
  let data = req.body;
  let { id } = req.params;
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
      .max(200)
      .required(),
    body: Joi.string()
      .min(5)
      .max(1000)
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
    data.updatedAt = Date.now();

    data.imageUrl = files.myfiles.name;
    // localhost:8000/public/data.imageurl => while display in react
    let result = await post.updateOne({ _id: id,createdBy:req.userData._id }, { $set: data });

    if (result.nModified === 0) {
      res.status(400).json({
        message: "Failed to update data"
      });
    }
    res.status(200).json({
      updated: "Ok",
      newPost: result
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
const deletePost = async (req, res) => {
  let { id } = req.params;
  try {
    let result = await post.deleteOne({ _id: id,createdBy:req.userData._id });
    if(result.deletedCount === 0){
      return res.status(400).json({
        message:'failed to delete data'
      })
    }
    res.status(200).json({
      status: "ok",
      post: result
    });
  } catch {
    res.status(500).json({
      message: err.message
    });
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  deletePost,
  updatePost,
  getUserPosts
};
