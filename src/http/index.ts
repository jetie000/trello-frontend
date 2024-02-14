import { AuthResponse } from "@/types/authResponse.interface";
import { variables } from "@/variables";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
    withCredentials: true,
    baseURL: variables.API_URL
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (config.headers)
        config.headers.Authorization = `Bearer ${localStorage.getItem(variables.TOKEN_LOCALSTORAGE)}`
    return config;
})

api.interceptors.response.use((config: AxiosResponse) => {
    return config
}, async (error: AxiosError) => {
    const origRequest = error.config
    if (error.response?.status == 401 && origRequest && !(error.config as any)?._isRetry) {
        (origRequest as any)._isRetry = true
        try {
            const response = await axios.get<AuthResponse>(`${variables.API_URL}/auth/refresh`, { withCredentials: true })
            localStorage.setItem(variables.TOKEN_LOCALSTORAGE, response.data.accessToken)
            return api.request(origRequest as AxiosRequestConfig)
        } catch (e) {
            console.log("Not authorized")
        }
    }
})