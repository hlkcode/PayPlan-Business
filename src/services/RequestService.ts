import { BaseService } from './BaseService'
import type { ApiResponse, PaginatedList, PaginationDto } from '@/models/common'
import type { Request } from '@/models/admin'

class RequestService extends BaseService {
  private readonly basePath = '/Requests'

  async getAll(params: PaginationDto): Promise<ApiResponse<PaginatedList<Request>>> {
    return this.get<ApiResponse<PaginatedList<Request>>>(`${this.basePath}/all`, { params })
  }

  async getPending(params: PaginationDto): Promise<ApiResponse<PaginatedList<Request>>> {
    return this.get<ApiResponse<PaginatedList<Request>>>(`${this.basePath}/pending`, { params })
  }

  async getById(id: number): Promise<ApiResponse<Request>> {
    return this.get<ApiResponse<Request>>(`${this.basePath}/${id}`)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async approve(payload: any): Promise<ApiResponse<boolean>> {
    return this.post<ApiResponse<boolean>>(`${this.basePath}/approval`, payload)
  }
}

export const requestService = new RequestService()
