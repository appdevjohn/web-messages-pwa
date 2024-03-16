import axios from 'axios'

const restAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

export default restAPI
