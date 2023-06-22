const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})


blogRouter.post('/', async (request, response) => {
  const { title, author, url, likes, userId } = request.body

  // let user

  // if (!userId) {
  //   const totalUsers = await User.countDocuments()
  //   const randomIndex = Math.floor(Math.random() * totalUsers)
  //   const randomUser = await User.findOne().skip(randomIndex)
  //   console.log('randomUser> ', randomUser)
  //   user = randomUser
  //   console.log('user ', user)
  // } else {
  //   user = await User.findById(userId)
  //   console.log('user ', user)
  // }

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

 
  if (!title || !url) {
    return response.status(400).json({ error: 'Title and URL are required' })
  }
  

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes ? likes : 0, // Set likes to 0 if it is missing
    user: user.id
  })

  const savedBlog = await blog.save()
  console.log('savedBlog> ', savedBlog)
  user.blogs = user.blogs.concat(savedBlog._id)
  console.log('user.blogs: ', user.blogs)
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

  await Blog.findByIdAndRemove(id)
  
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const { likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { likes },
    { new: true }
  )

  response.json(updatedBlog)
})

module.exports = blogRouter