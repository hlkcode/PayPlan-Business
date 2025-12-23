import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axiosInstance from '@/utils/axios'

export abstract class BaseService {
    protected readonly api: AxiosInstance

    constructor() {
        this.api = axiosInstance
    }

    protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.api.get(url, config)
        return response.data
    }

    protected async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.api.post(url, data, config)
        return response.data
    }

    protected async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.api.put(url, data, config)
        return response.data
    }

    protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.api.delete(url, config)
        return response.data
    }
}
