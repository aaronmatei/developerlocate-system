const express = require('express')
const router = express.Router()

const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const keys = require('../../config/keys')
const passport = require('passport')

// load Input validation
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

// Load User model
const User = require('../../models/User')

// @route   GET api/users/test
// desc     Tests users route
// access   Pulic
router.get('/test', (req, res) => res.json({msg: 'users works'}))
// @route   POST api/users/register
// desc     Register user
// access   Pulic
router.post('/register', (req, res) => {
    const {errors, isValid} = validateRegisterInput(req.body)

    // check validation

    if (!isValid) {
        return res.status(400).json(errors)
    }


    User.findOne({email: req.body.email}).then(user => {
        if (user) {
            errors.email = 'Email already exists'
            return res.status(400).json(errors)
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200', // size
                r: 'pg', // rating
                d: "mm" // default
            })
            const newUser = new User({name: req.body.name, email: req.body.email, avatar: avatar, password: req.body.password})
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) 
                        throw err


                    


                    newUser.password = hash
                    newUser.save().then(user => res.json(user)).catch(err => console.log(err))
                })
            })
        }
    })
})


// @route   POST api/users/login
// desc     Log in user / returning JWT Token
// access   Pulic
router.post('/login', (req, res) => {

    const {errors, isValid} = validateLoginInput(req.body)

    // check validation

    if (!isValid) {
        return res.status(400).json(errors)
    }


    const email = req.body.email
    const password = req.body.password


    // find user with that email
    User.findOne({email: email}).then(user => { // check for user
        if (!user) {
            errors.email = 'User with that email not found'
            return res.status(404).json(errors)
        }
        // check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // password matched
                // creating JWT token
                const payload = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar
                }


                // Sign token
                jwt.sign(payload, keys.secret, {
                    expiresIn: 3600
                }, (err, token) => {
                    res.json({
                        success: true,
                        token: 'Bearer ' + token
                    })
                })
                // res.json({msg: 'user match success'})
            } else {
                errors.password = 'Oops!!..Password is wrong'
                return res.status(400).json(errors)
            }
        })
    })
})
// @route   GET api/users/current
// desc     Return current user
// access   Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({id: req.user.id, name: req.user.name, email: req.user.email})
})

module.exports = router
