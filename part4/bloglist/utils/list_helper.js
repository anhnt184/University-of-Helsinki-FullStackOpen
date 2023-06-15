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
  favoriteBlog,
  totalLikes,
  dummy
}
  
  