const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')


const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const app = express()

// Body Parser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


// DB config
const uri = require('./config/keys')


mongoose.connect(uri.database, uri.options).then(() => {
    console.log(`Connection to the ${
        uri.options.dbName
    } database is successful!`)
}).catch((error) => console.log(JSON.stringify(error)))


// Passport middleware
app.use(passport.initialize())

// Passport config
require('./config/passport')(passport)


// use routes
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)


const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server running on port ${port}`))
