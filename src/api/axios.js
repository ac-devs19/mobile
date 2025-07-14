import axiosClient from "axios"
import { getToken } from "../services/TokenService"

const axios = axiosClient.create({
  baseURL: `${process.env.EXPO_BASE_URL}/api`,
  headers: {
    Accept: "application/json",
    "Content-Type": "multipart/form-data"
  }
})

axios.interceptors.request.use(async (req) => {
  const token = await getToken()

  if (token !== null) {
    req.headers["Authorization"] = `Bearer ${token}`
  }

  return req
})

export default axios