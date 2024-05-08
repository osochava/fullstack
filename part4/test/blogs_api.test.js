const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')


beforeEach(async () => {
  console.log('beforeEach')

  await User.deleteMany({})
  for (let user of helper.initialListWithUsers) {
    const passwordHash = await bcrypt.hash(user.password, 10)
    let userObject = new User({ _id: user._id, username: user.username, passwordHash })
    await userObject.save()
  }

  await Blog.deleteMany({})
  for (let blog of helper.initialListWithBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }

})

test('blogs are returned as json', async () => {
  const token = helper.tokenOfUser(0)
  console.log(token)
  await api
    .get('/api/blogs')
    .set({ Authorization: `${token}` })
    .expect(200)
    .expect('Content-Type', /application\/json/)
})


test('blogs have id property', async () => {
  const token = helper.tokenOfUser(0)
  const response = await api
    .get('/api/blogs')
    .set({ Authorization: `${token}` })
  const ids = response.body.map(r => r.id)
  assert(ids.length == response.body.length)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'The test title',
    author: 'Test2 Test',
    url: 'www.test.org',
    likes: '5'
  }
  const token = helper.tokenOfUser(0)
  await api
    .post('/api/blogs')
    .set({ Authorization: `${token}` })
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialListWithBlogs.length + 1)

  console.log(newBlog)
  console.log(blogsAtEnd)
  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes('The test title'))
})

test('a valid blog cannot be added witout Authorization token', async () => {
  const newBlog = {
    title: 'The title aaa',
    author: 'a a',
    url: 'www.aaaa.org',
    likes: '2'
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialListWithBlogs.length)
})

test('a blog without likes property has added with likes equals 0', async () => {
  const blogWithoutLikes = {
    title: 'The test title without likes',
    author: 'Test Test',
    url: 'www.test.org'
  }
  const token = helper.tokenOfUser(0)
  const response = await api
    .post('/api/blogs')
    .set({ Authorization: `${token}` })
    .send(blogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  assert(response.body.likes === 0)
})


test('blog without title is not added', async () => {
  const blogWithoutTitle = {
    author: 'Test Test',
    url: 'www.test.org',
    likes: 3
  }
  const token = helper.tokenOfUser(0)
  await api
    .post('/api/blogs')
    .set({ Authorization: `${token}` })
    .send(blogWithoutTitle)
    .expect(400)
})


test('blog without url is not added', async () => {
  const blogWithoutUrl = {
    title: 'The test title',
    author: 'Test Test',
    likes: 3
  }
  const token = helper.tokenOfUser(0)
  await api
    .post('/api/blogs')
    .set({ Authorization: `${token}` })
    .send(blogWithoutUrl)
    .expect(400)
})

test('a blog can be deleted only by creator', async () => {
  const creatorIndex = 0
  const diffUserIndex = 1
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart.find(b => b.user._id.toString() === helper.initialListWithUsers[creatorIndex]._id.toString())
  const token = helper.tokenOfUser(diffUserIndex)
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set({ Authorization: `${token}` })
    .expect(403)

  const blogsAtEnd = await helper.blogsInDb()

  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes(blogToDelete.title))
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
})

test('a blog can be deleted by creator', async () => {
  const creatorIndex = 0
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart.find(b => b.user._id.toString() === helper.initialListWithUsers[creatorIndex]._id.toString())
  const token = helper.tokenOfUser(creatorIndex)
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set({ Authorization: `${token}` })
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  const titles = blogsAtEnd.map(b => b.title)
  assert(!titles.includes(blogToDelete.title))
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
})


test('a blog can be updated', async () => {
  const token = helper.tokenOfUser(1)
  const blogsAtStart = await helper.blogsInDb()
  const blogId = blogsAtStart[0].id
  const blogToUpdate =
  {
    title: blogsAtStart[0].title,
    author: blogsAtStart[0].author,
    url: blogsAtStart[0].url,
    likes: blogsAtStart[0].likes + 1
  }
  await api.put(`/api/blogs/${blogId}`)
    .set({ Authorization: `${token}` })
    .send(blogToUpdate)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlogFromDb = blogsAtEnd.find(b => b.id = blogId)
  assert.strictEqual(updatedBlogFromDb.likes, blogToUpdate.likes)
})


after(async () => {
  await mongoose.connection.close()
})
