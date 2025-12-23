import { BaseService } from './BaseService'
import type { Company, UpdateCompanyInput, CompanyDocument } from '@/models/admin'
import type { ApiResponse, PaginatedList, PaginationDto } from '@/models/common'

class CompanyService extends BaseService {
  private readonly basePath = '/Companies'

  async getAll(params: PaginationDto): Promise<ApiResponse<PaginatedList<Company>>> {
    return this.get<ApiResponse<PaginatedList<Company>>>(this.basePath, { params })
  }

  async getById(id: number): Promise<ApiResponse<Company>> {
    // Assuming GET /Companies/{id} exists or using filter.
    // Docs showed PUT /Companies/{id}, usually implies GET exists.
    // If not, we might need to filter list. Let's assume standard REST for now.
    return this.get<ApiResponse<Company>>(`${this.basePath}/${id}`)
  }

  async update(id: number, data: UpdateCompanyInput): Promise<ApiResponse<boolean>> {
    return this.put<ApiResponse<boolean>>(`${this.basePath}/${id}`, data)
  }

  async activate(id: number, activate: boolean): Promise<ApiResponse<boolean>> {
    return this.post<ApiResponse<boolean>>(`${this.basePath}/activation`, { id, activate })
  }

  async getDocuments(
    companyId: number,
    params?: PaginationDto,
  ): Promise<ApiResponse<PaginatedList<CompanyDocument>>> {
    return this.get<ApiResponse<PaginatedList<CompanyDocument>>>(
      `${this.basePath}/${companyId}/documents`,
      { params },
    )
  }

  async deleteDocument(docId: number): Promise<ApiResponse<boolean>> {
    return this.delete<ApiResponse<boolean>>(`${this.basePath}/documents/${docId}`)
  }
}

export const companyService = new CompanyService()
