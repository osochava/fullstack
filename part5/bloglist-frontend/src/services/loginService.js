import axios from "axios"
const baseUrl = '/api/login'

const login = async credentials => {
  const responce = await axios.post(baseUrl, credentials)
  return responce.data
}

export default { login }