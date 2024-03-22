
const logger = require('./logger')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const countLikes = (sum, item) => { return sum + item.likes }
  return blogs.reduce(countLikes, 0)
}

const favoriteBlog = (blogs) => {
  const findFavorite = (fav, item) => { return fav.likes <= item.likes ? item : fav }
  const favBlog = blogs.reduce(findFavorite, { likes: 0 })
  logger.info(favBlog)
  return blogs.length === 0 ? undefined :
    {
      title: favBlog.title,
      author: favBlog.author,
      likes: favBlog.likes
    }
}
module.exports = {
  dummy, totalLikes, favoriteBlog
}