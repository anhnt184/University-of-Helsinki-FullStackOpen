import axios from 'axios'

const baseUrl = '/api/users'

const getAllUsers = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getUser = async (id) => {
  const users = await getAllUsers()
  const user = users.find((user) => user.id === id)
  console.log('user in getU: ', user)
  return user
}

export default { getAllUsers, getUser }
