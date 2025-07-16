import axiosClient from "axios"
import { getToken } from "../services/TokenService"

const axios = axiosClient.create({
  baseURL: "http://192.168.0.11:8000/api",
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