const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')


beforeEach(async () => {
  console.log('beforeEach')
  await Blog.deleteMany({})
  for (let blog of helper.initialListWithBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('blogs are returned as json', async () => {
  console.log('in test')
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})


test('blogs have id property', async () => {
  console.log('in test')
  const response = await api.get('/api/blogs')
  const ids = response.body.map(r => r.id)
  assert(ids.length == response.body.length)
})

test('a valid blog can be added', async () => {
  console.log('in test')
  const newBlog = {
    title: 'The test title',
    author: 'Test2 Test',
    url: 'www.test.org',
    likes: '5'
  }
  await api
    .post('/api/blogs')
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

test('a blog without likes property has added with likes equals 0', async () => {
  console.log('in test')
  const blogWithoutLikes = {
    title: 'The test title without likes',
    author: 'Test Test',
    url: 'www.test.org'
  }
  const response = await api
    .post('/api/blogs')
    .send(blogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  assert(response.body.likes === 0)
})


test('blog without title is not added', async () => {
  console.log('in test')
  const blogWithoutTitle = {
    author: 'Test Test',
    url: 'www.test.org',
    likes: 3
  }
  await api
    .post('/api/blogs')
    .send(blogWithoutTitle)
    .expect(400)
})


test('blog without url is not added', async () => {
  console.log('in test')
  const blogWithoutUrl = {
    title: 'The test title',
    author: 'Test Test',
    likes: 3
  }
  await api
    .post('/api/blogs')
    .send(blogWithoutUrl)
    .expect(400)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]
  await api.delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  const titles = blogsAtEnd.map(b => b.titles)
  assert(!titles.includes(blogToDelete.title))
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
})

test('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogId = blogsAtStart[0].id
  const blogToUpdate =
  {
    title: blogsAtStart[0].title,
    author: blogsAtStart[0].author,
    url: blogsAtStart[0].url,
    likes: blogsAtStart[0].likes + 1
  }
  console.log(blogToUpdate)
  await api.put(`/api/blogs/${blogId}`)
    .send(blogToUpdate)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlogFromDb = blogsAtEnd.find(b => b.id = blogId)
  assert.strictEqual(updatedBlogFromDb.likes, blogToUpdate.likes)
})


after(async () => {
  await mongoose.connection.close()
})
