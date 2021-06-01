// BUILD YOUR SERVER HERE
const express = require('express')
const User = require('./users/model')

const server = express()

server.use(express.json())

// [GET] /api/users (R of CRUD, fetch all users)
server.get('/api/users', (req, res) => {
    // pull users from db
    User.find()
    .then(users => {
        // send users back to client
        res.json(users)
    })
    .catch(err => {
        res.status(500).json({ 
            message: 'The users information could not be retrieved', 
            error: err.message
        })
    })
})
// [GET] /api/users/:id (R of CRUD, fetch user by :id)
server.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            res.status(404).json({
                message: `The user with the specified ID does not exist`
            })
        }
        else {
            res.json(user)
        }
    }
    catch (err) {
        res.status(500).json({
            message: 'error getting dog by id', 
            error: err.message
        })
    }
})
// [POST] /api/users (C of CRUD, create new user from JSON payload)
server.post('/api/users', async (req, res) => {
    try {
        // pull user info from req.body
        // use User.insert with req.body
        // send back to client the new dog
        if (!req.body.name || !req.body.bio) {
            res.status(400).json({
                message: 'Please provide name and bio for the user'
            })
        }
        else {
        const newUser = await User.insert(req.body)
        res.status(201).json(newUser)
        }
    }
    catch (err) {
        res.status(500).json({
            message: 'error posting new dog', 
            error: err.message
        })
    }
})
// [PUT] /api/users/:id (U of CRUD, update user with :id using JSON payload)
server.put('/api/users/:id', async (req, res) => {
    const { id } = req.params
    const { body } = req
    try {
        const updated = await User.update(id, body)
        if (!updated) {
            res.status(404).json({
                message: `The user with the specified ID does not exist`
            })
        }
        else if (!req.body.name || !req.body.bio) {
            res.status(400).json({
                message: 'Please provide name and bio for the user'
            })
        }
        else {
            res.json(updated)
        }
    }
    catch (err) {
        res.status(500).json({
            message: 'The user information could not be modified', 
            error: err.message
        })
    }
})
// [DELETE] /api/users/:id (D of CRUD, remove user with :id)
server.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params
    User.remove(id)
    .then(deletedUser => {
        if (!deletedUser) {
            res.status(404).json({
                message: `The user with the specified ID does not exist`
            })
        }
        else {
            res.json(deletedUser)
        }
    })
    .catch(err => {
        res.status(500).json({
            message: 'The user could not be removed', 
            error: err.message
        })
    })
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
