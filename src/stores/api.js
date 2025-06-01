import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_CASTOON_API || 'http://localhost:1337',
})

export default api
