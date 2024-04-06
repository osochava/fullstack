//const logger = require('./logger')
var lodash = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const countLikes = (sum, item) => { return sum + item.likes }
  return blogs.reduce(countLikes, 0)
}

const favoriteBlog = (blogs) => {
  const findFavorite = (fav, item) => { return fav.likes <= item.likes ? item : fav }
  const favBlog = blogs.reduce(findFavorite, { likes: 0 })
  //logger.info(favBlog)
  return blogs.length === 0 ? undefined :
    {
      title: favBlog.title,
      author: favBlog.author,
      likes: favBlog.likes
    }
}

const mostBlogs = (blogs) => {
  const maxAuthor = lodash.maxBy(lodash.map(lodash.groupBy(blogs, 'author'),
    (val, key) => {
      return {
        author: key,
        blogs: val.length
      }
    }), (val) => val.blogs)
  return blogs.length === 0 ? undefined : maxAuthor
}

const mostLikes = (blogs) => {
  const mostLikesAuthor = lodash(blogs).groupBy('author').map((val, key) => {
    return {
      author: key,
      likes: lodash.sumBy(val, v => v.likes)
    }
  }).maxBy((val) => val.likes)
  return blogs.length === 0 ? undefined : mostLikesAuthor
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}