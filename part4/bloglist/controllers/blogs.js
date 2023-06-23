const blogRouter = require('express').Router()
const Blog = require('../models/blog')


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})


blogRouter.post('/', async (request, response) => {
  const { title, author, url, likes} = request.body

  if (!request.user) {
    return response.status(401).json({ error: 'Unauthorized' })
  }
  const user = request.user

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
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'authorization token missing' })
  }
  
  const blog = await Blog.findById(id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  
  if (blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'unauthorized' })
  }

  await Blog.findByIdAndRemove(id)

  user.blogs = user.blogs.filter(b => b.toString() !== id.toString())
  await user.save()
  
  response.status(204).end()
})


blogRouter.put('/:id', async (request, response) => {
  const user = request.user
  const id = request.params.id
  const { likes } = request.body

  const blog = await Blog.findById(id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'unauthorized' })
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { likes },
    { new: true }
  )

  response.json(updatedBlog)
})

module.exports = blogRouter