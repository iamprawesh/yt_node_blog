const express = require('express')
const router = express.Router()
const  {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
} = require('../controller/postController')
router.get('/',getPosts)
router.get('/:id',getPost)

router.post('/',createPost)

router.patch('/:id',updatePost)

router.delete('/:id',deletePost)
// for autherntication
const {signup,login} = require('../controller/userController')
router.post('/user/login',login)
router.post('/user/signup',signup)


module.exports = router