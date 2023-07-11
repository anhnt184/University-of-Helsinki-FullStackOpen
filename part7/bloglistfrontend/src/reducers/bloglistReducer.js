import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const bloglistSlice = createSlice({
  name: 'bloglist',
  initialState: [],
  reducers: {
    likeBlog(state, action) {
      const id = action.payload
      const blogToLike = state.find((blog) => blog.id === id)
      blogToLike.likes += 1
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlog(state, action) {
      return action.payload
    },
    removeBlog(state, action) {
      const blogId = action.payload
      return state.filter((blog) => blog.id !== blogId)
    }

  },
})

export const { likeBlog, appendBlog, setBlog, removeBlog } = bloglistSlice.actions

export const initializeBloglist = () => {
  return async dispatch => {
    const bloglist = await blogService.getAll()
    // console.log('bloglist: ', bloglist)
    dispatch(setBlog(bloglist))
  }
}

export const addBloglist = (content, user) => {
  return async dispatch => {
    const newBlog = await blogService.create(content)
    const populatedBlog = {
      ...newBlog,
      user: user,
    }
    dispatch(appendBlog(populatedBlog))
  }
}


export default bloglistSlice.reducer

