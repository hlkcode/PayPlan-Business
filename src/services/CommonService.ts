import { BaseService } from './BaseService'
import type { ApiResponse, Country } from '@/models/common'

class CommonService extends BaseService {
    async getCountries(): Promise<ApiResponse<Country[]>> {
        console.log('Fetching countries from /Countries/supported-list')
        const response = await this.get<ApiResponse<Country[]>>('/Countries/supported-list')
        console.log('Countries response:', response)
        return response
    }

    async getAllCountries(): Promise<ApiResponse<Country[]>> {
        return await this.get<ApiResponse<Country[]>>('/Countries')
    }
}

export const commonService = new CommonService()
