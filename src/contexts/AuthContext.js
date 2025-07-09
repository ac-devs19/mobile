import { createContext, useContext, useEffect, useState } from "react"
import axios from "../api/axios"
import { setToken } from "../services/TokenService"
import { Alert } from "react-native"
import { router } from "expo-router"

const auth = createContext({})

export const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [email_address, setEmailAddress] = useState("")
  const [timer, setTimer] = useState()

  const url = "http://192.168.0.11:8000/"

  useEffect(() => {
    async function loadUser() {
      await getUser()
    }
    loadUser()
  }, [])

  const getUser = async () => {
    await axios.get("/user")
      .then(({ data }) => {
        setUser(data)
      })
  }

  const startTimer = () => {
    setTimer(180)
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval)
          return 0;
        }
        return prevTimer - 1
      });
    }, 1000)
  }

  const login = async ({ ...data }) => {
    setLoading(true)
    await axios.post("/login", data)
      .then(async ({ data }) => {
        await setToken(data.token)
        await getUser()
      })
      .catch((error) => {
        const response = error.response
        if (response.status === 422) {
          if (response.data.errors.message) {
            Alert.alert("Error!", `${response.data.errors.message}`)
          }
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const forgotPassword = async ({ ...data }) => {
    setLoading(true)
    await axios.post("/forgot-password", data)
      .then(() => {
        setEmailAddress(data.student_email_address)
        router.navigate('/email-verification')
        startTimer()
      })
      .catch((error) => {
        const response = error.response
        if (response.status === 422) {
          if (response.data.errors.message) {
            Alert.alert("Error!", `${response.data.errors.message}`)
          }
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const createNewPassword = async ({ ...data }) => {
    setLoading(true)
    await axios.post("/create-new-password", data)
      .then(() => {
        router.navigate('/sign-in')
      })
      .catch((error) => {
        const response = error.response
        if (response.status === 422) {
          if (response.data.errors.message) {
            Alert.alert("Error!", `${response.data.errors.message}`)
          }
          if (response.data.errors.password) {
            Alert.alert("Error!", `${response.data.errors.password[0]}`)
          }
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const verifyOtp = async ({ ...data }) => {
    setLoading(true)
    await axios.post("/verify-otp", data)
      .then(() => {
        router.navigate('/create-new-password')
      })
      .catch((error) => {
        const response = error.response
        if (response.status === 422) {
          if (response.data.errors.message) {
            Alert.alert("Error!", `${response.data.errors.message}`)
          }
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const resendOtp = async (email_address) => {
    setLoading(true)
    await axios.post("/resend-otp", { email_address })
      .then(() => {
        startTimer()
      })
      .catch((error) => {
        const response = error.response
        if (response.status === 422) {
          if (response.data.errors.message) {
            Alert.alert("Error!", `${response.data.errors.message}`)
          }
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const changePassword = async ({ ...data }) => {
    setLoading(true)
    await axios.post("/change-password", data)
      .then(async () => {
        await getUser()
        router.back()
      })
      .catch((error) => {
        const response = error.response
        if (response.status === 422) {
          if (response.data.errors.message) {
            Alert.alert("Error!", `${response.data.errors.message}`)
          }
          if (response.data.errors.password) {
            Alert.alert("Error!", `${response.data.errors.password[0]}`)
          }
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const logout = async () => {
    setLoading(true)
    await axios.get("/logout")
      .then(() => {
        setToken(null)
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <auth.Provider value={{ user, loading, email_address, timer, url, login, forgotPassword, createNewPassword, verifyOtp, resendOtp, changePassword, logout }}>
      {children}
    </auth.Provider>
  )
}

export const useAuthContext = () => useContext(auth)