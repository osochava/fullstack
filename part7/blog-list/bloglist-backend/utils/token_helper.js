const jwt = require('jsonwebtoken')

const generateToken = (username, _id) => {
  const userForToken = {
    username: username,
    id: _id
  }

  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60 * 60 })
  return token
}

module.exports = { generateToken }