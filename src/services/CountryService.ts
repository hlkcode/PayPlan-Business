import { BaseService } from './BaseService'
import type { Country, ApiResponse, PaginatedList, PaginationDto } from '@/models/common'
import type { CountryDocument } from '@/models/admin'

class CountryService extends BaseService {
  private readonly basePath = '/Countries'

  async getAll(params: PaginationDto): Promise<ApiResponse<PaginatedList<Country>>> {
    return this.get<ApiResponse<PaginatedList<Country>>>(this.basePath, { params })
  }

  async getSupportedList(): Promise<ApiResponse<Country[]>> {
    return this.get<ApiResponse<Country[]>>(`${this.basePath}/supported-list`)
  }

  async activate(id: number, activate: boolean): Promise<ApiResponse<boolean>> {
    return this.post<ApiResponse<boolean>>(`${this.basePath}/activation`, { id, activate })
  }

  async getDocuments(
    countryId: number,
    params?: PaginationDto,
  ): Promise<ApiResponse<PaginatedList<CountryDocument>>> {
    return this.get<ApiResponse<PaginatedList<CountryDocument>>>(
      `${this.basePath}/${countryId}/documents`,
      { params },
    )
  }

  async getDocumentTypes(
    countryId: number,
    params?: PaginationDto,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<ApiResponse<PaginatedList<any>>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.get<ApiResponse<PaginatedList<any>>>(
      `${this.basePath}/${countryId}/documentTypes`,
      { params },
    )
  }
}

export const countryService = new CountryService()
