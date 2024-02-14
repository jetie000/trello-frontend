import { variables } from "@/variables";
import axios, { InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
    withCredentials: true,
    baseURL: variables.API_URL
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (config.headers)
        config.headers.Authorization = `Bearer ${localStorage.getItem(variables.USER_LOCALSTORAGE)}`
    return config;
})