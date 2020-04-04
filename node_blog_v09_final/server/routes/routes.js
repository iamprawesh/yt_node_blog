const express = require('express')
const router = express.Router()
const  {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    getUserPosts
} = require('../controller/postController')
const checkAuth = require('../middlewares/checkAuth')
router.get('/',getPosts)
router.get('/:id',getPost)
router.get('/posts/:id',getUserPosts)


router.post('/',checkAuth,createPost)

router.patch('/:id',checkAuth,updatePost)
// 
router.delete('/:id',checkAuth,deletePost)
// for autherntication
const {signup,login} = require('../controller/userController')
router.post('/user/login',login)
router.post('/user/signup',signup)


module.exports = router