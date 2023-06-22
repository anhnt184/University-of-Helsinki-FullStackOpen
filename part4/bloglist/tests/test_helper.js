const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Blog number 1',
    author: 'Tuan Anh Nguyen',
    url: 'https://tuananh.com/',
    likes: 99
  },
  {
    title: 'Blog number 2',
    author: 'Quoc Khanh Nguyen',
    url: 'https://quockhanh.com/',
    likes: 66
  },
  {
    title: 'Blog number 3',
    author: 'Trung Kien Nguyen, Khanh Vy Nguyen',
    url: 'https://trungkienkhanhvy.com/',
    likes: 99
  }
]

const nonExistingId = async () => {
  const blog = new Blog({title: 'willremovethissoon' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
}