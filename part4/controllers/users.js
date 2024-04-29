const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (password === undefined || password.length < 3) {
    return response.status(400).json({ error: 'the password field is required and must have at least 3 characters long' })
  }

  const userInDb = await User.findOne({ username })

  if (!!userInDb || !username || username.length < 3) {
    return response.status(400).json({ error: 'username should be unique and must have at least 3 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, responce) => {
  const users = await User.find({})
  responce.json(users)
})

module.exports = usersRouter