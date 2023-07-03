import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification: (state, action) => {
      return action.payload;
    },
    removeNotification: (state) => {
        return null;
      },
  },
});

export const { setNotification, removeNotification } = notificationSlice.actions;
// Action creator with timeout
export const setNotificationWithTimeout = (message, timeout) => {
    return (dispatch) => {
      dispatch(setNotification(message))
      setTimeout(() => {
        dispatch(removeNotification())
      }, timeout * 500);
    }
  }

export default notificationSlice.reducer;
