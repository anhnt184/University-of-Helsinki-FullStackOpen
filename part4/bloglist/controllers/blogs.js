const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', (request, response) => {
  const { title, author, url, likes } = request.body

  if (!title || !url) {
    return response.status(400).json({ error: 'Title and URL are required' })
  }
  
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes ? likes : 0 // Set likes to 0 if it is missing
  })

  const savedBlog = blog.save()
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