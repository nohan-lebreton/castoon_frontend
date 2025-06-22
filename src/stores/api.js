import axios from 'axios'

// Create axios instance with base URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_CASTOON_API || 'http://localhost:1337',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response && error.response.status === 401) {
      // Clear local storage on auth errors
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
    return Promise.reject(error)
  },
)

export default api
