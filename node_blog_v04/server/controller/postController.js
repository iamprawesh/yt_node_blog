// BLOG PROJECT
// post : title,body,imageUrl,createdAt,createby
// user : name,email,password

const getPosts = (req,res)=>{
    
    res.send("Get all Post ")
}
const getPost = (req,res)=>{
    res.send("Get Single Post")
}
const createPost = (req,res)=>{
    res.send("Created Post")
}
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
    updatePost,
    deletePost
}