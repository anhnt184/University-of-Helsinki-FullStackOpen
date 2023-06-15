const _ = require('lodash')

// Most likes function
const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const groupedBlogs = _.groupBy(blogs, 'author')
  
  const authorLikes = _.mapValues(groupedBlogs, (blogs) => {
    return _.sumBy(blogs, 'likes')
  })
  
  const maxAuthor = _.maxBy(_.keys(authorLikes), (author) => authorLikes[author])
  const maxLikes = authorLikes[maxAuthor]
  
  return { author: maxAuthor, likes: maxLikes }
}

// Most blogs function
const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  
  const groupedBlogs = _.groupBy(blogs, 'author')
  const authorCounts = _.mapValues(groupedBlogs, 'length')
  const maxAuthor = _.maxBy(_.keys(authorCounts), (author) => authorCounts[author])
  const maxBlogs = authorCounts[maxAuthor]
  
  return {
    author: maxAuthor,
    blogs: maxBlogs
  }
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null // Return null if the list is empty
  }
  
  // Find the blog with the most likes using the reduce method
  const favorite = blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max))
  
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  }
}
  
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const dummy = (blogs) => {
  return 1
}
  
module.exports = {
  mostLikes,
  mostBlogs,
  favoriteBlog,
  totalLikes,
  dummy
}
  
  