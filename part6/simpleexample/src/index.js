import React from 'react'
import ReactDOM from 'react-dom/client'

// import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import store from './store'

import App from './App'
// import noteReducer, { setNotes } from './reducers/noteReducer'
// import filterReducer from './reducers/filterReducer'

// import noteService from './services/notes'



// const store = configureStore({
//   reducer: {
//     notes: noteReducer,
//     filter: filterReducer
//   }
// })

// noteService.getAll().then(notes =>
//   store.dispatch(setNotes(notes))
// )
// console.log(store.getState())

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)