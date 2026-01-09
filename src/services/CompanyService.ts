import { BaseService } from './BaseService'
import type {
  Company,
  UpdateCompanyInput,
  CompanyDocument,
  Invite,
  InviteUsersToCompanyInput,
  CompanyUser,
  DocumentType,
} from '@/models/admin'
import type { ApiResponse, PaginatedList, PaginationDto } from '@/models/common'

class CompanyService extends BaseService {
  private readonly basePath = '/Companies'

  async getAll(params: PaginationDto): Promise<ApiResponse<PaginatedList<Company>>> {
    return this.get<ApiResponse<PaginatedList<Company>>>(this.basePath, { params })
  }

  async getUserCompanies(
    userId: number,
    params: PaginationDto,
  ): Promise<ApiResponse<PaginatedList<Company>>> {
    return this.get<ApiResponse<PaginatedList<Company>>>(`/business-accounts/${userId}/companies`, {
      params,
    })
  }

  async getById(id: number): Promise<ApiResponse<Company>> {
    return this.get<ApiResponse<Company>>(`${this.basePath}/${id}`)
  }

  async update(id: number, data: UpdateCompanyInput): Promise<ApiResponse<boolean>> {
    return this.put<ApiResponse<boolean>>(`${this.basePath}/${id}`, data)
  }

  async activate(id: number, activate: boolean): Promise<ApiResponse<boolean>> {
    return this.post<ApiResponse<boolean>>(`${this.basePath}/activation`, { id, activate })
  }

  // Documents
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

  // Invites
  async getInvites(companyId: number): Promise<ApiResponse<PaginatedList<Invite>>> {
    return this.get<ApiResponse<PaginatedList<Invite>>>(`${this.basePath}/${companyId}/invites`)
  }

  async inviteUsers(data: InviteUsersToCompanyInput): Promise<ApiResponse<boolean>> {
    return this.post<ApiResponse<boolean>>(`${this.basePath}/invite`, data)
  }

  // Users
  async getCompanyUsers(
    companyId: number,
    params?: PaginationDto,
  ): Promise<ApiResponse<PaginatedList<CompanyUser>>> {
    // Assuming endpoint structure, similar to invites
    return this.get<ApiResponse<PaginatedList<CompanyUser>>>(
      `${this.basePath}/${companyId}/users`,
      {
        params,
      },
    )
  }

  async getNeededDocumentTypes(
    companyId: number,
  ): Promise<ApiResponse<PaginatedList<DocumentType>>> {
    return this.get<ApiResponse<PaginatedList<DocumentType>>>(
      `${this.basePath}/${companyId}/needed-documentTypes`,
    )
  }

  // KYC

  // KYC / Document Upload
  // Accepting generic FormData for flexibility as the controller creates it
  async submitKyc(data: FormData): Promise<ApiResponse<boolean>> {
    return this.post<ApiResponse<boolean>>(`/business-accounts/kyc`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
}

export const companyService = new CompanyService()
