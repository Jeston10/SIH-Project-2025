"use client"

import axios from "axios"

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  timeout: 20000,
})

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token")
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token")
        // Optional redirect can be added here
      }
    }
    return Promise.reject(error)
  }
)

export async function loginRequest(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password })
  return res.data
}

export async function registerRequest(payload: {
  email: string
  password: string
  userType: 'farmer' | 'facility' | 'laboratory' | 'regulatory' | 'user'
  profile: { firstName: string; lastName: string }
}) {
  const res = await api.post("/auth/register", payload)
  return res.data
}

export function getErrorMessage(err: any): string {
  if (err?.response?.data?.message) return err.response.data.message
  if (err?.message) return err.message
  return 'Something went wrong. Please try again.'
}

export async function getRealtimeStatus() {
  const res = await api.get("/realtime/status")
  return res.data
}

export async function fetchFarmerDashboard() {
  const res = await api.get("/farmer/dashboard")
  return res.data
}

export async function fetchFacilityDashboard() {
  const res = await api.get("/facility/dashboard")
  return res.data
}

export async function fetchLabDashboard() {
  const res = await api.get("/laboratory/dashboard")
  return res.data
}

export async function fetchUserDashboard() {
  const res = await api.get("/user/dashboard")
  return res.data
}


