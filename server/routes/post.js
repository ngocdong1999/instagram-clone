const express = require('express')
const router = express.Router()
const verifyToken = require('../middlewares/auth')
const fs = require('fs')

const upload = require('../storage/index')



const Post = require('../models/Post')
const User = require('../models/User')
const Like = require('../models/Like')

// @route GET api/posts/:username
// @desc Get post of user
// @access Private
router.get('/:username',verifyToken, async (req, res) => {
    try {
        const username = await User.findOne({username: req.params.username})
        const posts = await Post.find({user : username._id}).populate('user', ['username','image']).sort({createAt: -1})
        res.status(200).json({success: true, message: 'Loaded posts successfuly.', posts})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: 'Internal server error.'})
    }
})


// @route GET api/posts
// @desc Get post
// @access Private
router.get('/',verifyToken, async (req, res) => {
    try {
        let posts = await Post.find().populate('user', ['username','image','firstname','lastname']).sort({createAt: -1});
        res.status(200).json({success: true, message: 'Loaded posts successfuly.', posts})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: 'Internal server error.'})
    }
})



// @route POST api/posts
// @desc Create post
// @access Private

router.post('/',verifyToken ,upload.single('image') ,async (req, res) => {
    const url = req.protocol + '://' + req.get('host')
    const { title } = req.body

    if(!req.file) return res.status(400).json({success: false, message: 'Bắt buộc phải có ảnh.'})
    try {
        const newPost = new Post({
            title: title || '',
            image: req.file ? url + '/uploads/' + req.file.filename : "",
            user: req.userId
        })
        await newPost.save().then( newPost => newPost.populate('user', ['username','image','firstname','lastname']))
        return res.status(200).json({success: true, message: "Bài viết được tạo thành công.", post: newPost})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: 'Internal server error.'})
    }
})

// @route PUT api/posts
// @desc Update post
// @access Private

router.put('/:id', verifyToken, upload.single('image'),async (req, res) => {
    const url = req.protocol + '://' + req.get('host')
    const { title } = req.body

    try {
        const postUpdateCondition = {
            _id: req.params.id,
            user: req.userId
        }

        const oldPost = await Post.findOne(postUpdateCondition);
        //User not authorised to update post or post not found
        if(!oldPost) return res.status(401).json({success: false, message: 'Bài viết không được tìm thấy hoặc bạn không có quyền sửa bài viết.'})
        let updatePost = {
            title: title || '',
            image: req.file ? url + '/uploads/' + req.file.filename : ""
        }
        if(!req.file){
            updatePost.image = oldPost.image
        }else{
            const oldImage = oldPost.image.slice(oldPost.image.indexOf('/uploads') + 9)
            fs.unlinkSync(`./uploads/${oldImage}`)
        }
        
        updatePost = await Post.findOneAndUpdate(postUpdateCondition, updatePost, {new: true}).populate('user', ['username','image','firstname','lastname'])
        
        return res.status(200).json({success: true, message: "Bài viết đã được cập nhật thành công.", post: updatePost})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: 'Internal server error.'})
    }
})

// @route DELETE api/posts
// @desc Delete post
// @access Private

router.delete('/:id', verifyToken,async (req, res) => {
    try {
        const postDeleteCondition = {
            _id: req.params.id,
            user: req.userId
        }

        const oldPost = await Post.findOne(postDeleteCondition);
        if(!oldPost) return res.status(401).json({success: false, message: 'Bài viết không được tìm thấy hoặc bạn không có quyền xóa.'})
        const oldImage = oldPost.image.slice(oldPost.image.indexOf('/uploads') + 9)
        

        deletePost = await Post.findOneAndDelete(postDeleteCondition)
        deleteLike = await Like.deleteMany({post: req.params.id})
        if(oldImage){
            fs.unlinkSync(`./uploads/${oldImage}`)
        }
        return res.status(200).json({success: true, message: "Bài viết đã được xóa", post: deletePost})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: 'Internal server error.'})
    }
})


module.exports = router