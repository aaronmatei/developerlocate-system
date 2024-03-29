const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')


// Load Post and Profile models
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')

// Validation
const validatePostInput = require('../../validation/post')
const validateCommentInput = require('../../validation/comment')


// @route   GET api/posts/test
// desc     Tests posts route
// access   Pulic
router.get('/test', (req, res) => res.json({msg: 'posts works'}))


// @route   GET api/posts
// desc     Fetch a post
// access   Public
router.get('/', (req, res) => {
    Post.find().sort({date: -1}).then(posts => res.json(posts)).catch(err => res.status(404).json({noposts: 'no posts found'}))
})
// @route   GET api/posts/:id
// desc     Fetch a post by ID
// access   Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id).then(posts => res.json(posts)).catch(err => res.status(404).json({notfound: 'No post with such id'}))
})


// @route   POST api/posts
// desc     Create post
// access   Private

router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validatePostInput(req.body)
    // check validation
    if (!isValid) { // if any errors, send 400 with errors object
        return res.status(400).json(errors)
    }
    const newPost = new Post({text: req.body.text, name: req.body.name, avatar: req.body.avatar, user: req.user.id})
    newPost.save().then(post => res.json(post))
})

// @route   DELETE api/posts/:id
// desc     DELETE post with that id
// access   Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id}).then(profile => {
        Post.findById(req.params.id).then(post => { // check for post owner
            if (post.user.toString() !== req.user.id) {
                return res.status(401).json({notauthorized: 'you are not authorised to delete'})
            }
            // Delete
            post.remove().then(() => {
                res.json({deleted: 'post deleted successfully'})
            }).catch(err => res.status(404).json({notfound: 'post was not found'}))
        })
    })
})

// @route   POST api/posts/like/:id
// desc     Like post with that id
// access   Private
router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id}).then(profile => {
        Post.findById(req.params.id).then(post => { // check for post owner
            if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                return res.status(400).json({alreadyliked: 'User already liked this post'})
            }
            // Add the user id to the likes
            post.likes.unshift({user: req.user.id})
            post.save().then(post => res.json(post))


        }).catch(err => res.status(404).json({notfound: 'post was not found'}))
    })
})


// @route   POST api/posts/unlike/:id
// desc     unLike post with that id
// access   Private
router.post('/unlike/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id}).then(profile => {
        Post.findById(req.params.id).then(post => { // check for post owner
            if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                return res.status(400).json({notliked: 'You have not yet liked this post'})
            }
            // get the remove index
            const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id)


            // Splice out of the array
            post.likes.splice(removeIndex, 1)
            // save
            post.save().then(post => res.json(post))


        }).catch(err => res.status(404).json({notfound: 'post was not found'}))
    })
})

// @route   POST api/posts/comment/:id
// desc     comment a post with that id
// access   Private

router.post('/comment/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validateCommentInput(req.body)
    // check validation
    if (!isValid) { // if any errors, send 400 with errors object
        return res.status(400).json(errors)
    }
    Post.findById(req.params.id).then(post => {
        const newComment = {
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
        }
        // add to comments array
        post.comments.unshift(newComment)
        // save
        post.save().then(post => res.json(post))
    }).catch(err => res.status(404).json({notFound: 'No Post Found'}))
})


// @route   DELETE api/posts/comment/:post_id/:comment_id
// desc     Remove comment from post
// access   Private

router.delete('/comment/:post_id/:comment_id', passport.authenticate('jwt', {session: false}), (req, res) => {

    Post.findById(req.params.post_id).then(post => { // Check if comment exists
        if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
            return res.status(404).json({commentdoesnotexist: 'Comment does not exist'})
        }
        // Get the remove index
        const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id)
        // splice comment out of the array
        post.comments.splice(removeIndex, 1)
        // save post
        post.save().then(post => res.json(post))


    }).catch(err => res.status(404).json({notFound: 'No Post Found'}))
})


module.exports = router
