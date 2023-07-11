import { configureStore } from '@reduxjs/toolkit'

import bloglistReducer from './reducers/bloglistReducer'
import notificationReducer from './reducers/notificationReducer'
import userReducer from './reducers/userReducer'

const store = configureStore({
  reducer: {
    bloglist: bloglistReducer,
    notification: notificationReducer,
    user: userReducer,
  }
})

export default store