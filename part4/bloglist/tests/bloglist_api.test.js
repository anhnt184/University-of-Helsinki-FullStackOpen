const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})
describe('Add blog:', () => {
  test('the blog list are returned the correct amount of blog posts in the JSON format', async () => {
    const res = await api.get('/api/blogs')
    expect(res.body).toHaveLength(helper.initialBlogs.length)

    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'New blog for added',
      author: 'Anthony Nguyen',
      url: 'https://anthony.com/',
      likes: 3
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    //   console.log('Response:', response.body)
  
    const blogsAtEnd = await helper.blogsInDb()
    //   console.log('blogsAtEnd:', blogsAtEnd)
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
     
    const title = blogsAtEnd.map(b => b.title)
    expect(title).toContain(
      'New blog for added'
    )
  })

  test('a valid blog with missing likes defaults to 0', async () => {
    const newBlog = {
      title: 'New blog with missing likes',
      author: 'Anthony Nguyen',
      url: 'https://anthony.com/'
    // likes property is missing
    }
      
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      
    const response = await api.get('/api/blogs')
    const blogs = response.body
      
    const addedBlog = blogs.find(blog => blog.title === newBlog.title && blog.author === newBlog.author)
    expect(addedBlog.likes).toBe(0)
  })

  test('missing title or url properties result in 400 Bad Request', async () => {
    const newBlog = {
      author: 'John Doe',
      likes: 5
    // title and url properties are missing
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})
describe('View blog:', () => {
  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const blogsWithTitleAndAuthor = response.body.map(({ title, author }) => ({ title, author }))
  
    expect(blogsWithTitleAndAuthor).toContainEqual({
      title: 'Blog number 3',
      author: 'Trung Kien Nguyen, Khanh Vy Nguyen'
    })
  })

  test('the unique identifier property of blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
  
    blogs.forEach((blog) => {
      expect(blog.id).toBeDefined()
    })
  })
})

describe('Delete and update blog:', () => {
  test('deleting a blog post succeeds with status code 204', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
  
    const titles = blogsAtEnd.map((blog) => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
  
  test('updating the likes of a blog post succeeds', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updatedLikes = blogToUpdate.likes + 1
  
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: updatedLikes })
      .expect(200)
  
    const updatedBlog = response.body
  
    expect(updatedBlog.likes).toBe(updatedLikes)
  
    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlogInDb = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id)
    expect(updatedBlogInDb.likes).toBe(updatedLikes)
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
  
})


afterAll(async () => {
  await mongoose.connection.close()
})
