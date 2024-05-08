const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user
  const blog = new Blog(
    {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    if (error.name === 'ValidationError') {
      response.status(400).send({ message: 'title and url fields are required' })
    } else {
      throw (error)
    }
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if (blog.user._id.toString() === user._id.toString()) {
    await blog.deleteOne()
    response.status(204).end()
  }
  else {
    response.status(403).json({ error: 'blog can be deleted only by the user who added it' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog =
  {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter