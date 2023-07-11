import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification: (state, action) => {
      return {
        message: action.payload.message,
        type: action.payload.type,
      }
    },
    removeNotification: () => {
      return null
    },
  },
})

export const { setNotification, removeNotification } = notificationSlice.actions

// Thunk action creator with timeout
export const setNotificationWithTimeout = (message, type, timeout) => {
  return (dispatch) => {
    dispatch(setNotification({ message, type }))
    setTimeout(() => {
      dispatch(removeNotification())
    }, timeout * 1000)
  }
}

export default notificationSlice.reducer
