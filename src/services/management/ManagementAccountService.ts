import { BaseService } from '../BaseService'
import type { ManagementAccount, CreateManagementAccountInput } from '@/models/account'
import type { ApiResponse, PaginatedList, PaginationDto } from '@/models/common'

class ManagementAccountService extends BaseService {
  private readonly basePath = '/management-accounts'

  async getAll(params: PaginationDto): Promise<ApiResponse<PaginatedList<ManagementAccount>>> {
    return this.get<ApiResponse<PaginatedList<ManagementAccount>>>(this.basePath, { params })
  }

  async create(data: CreateManagementAccountInput): Promise<ApiResponse<number>> {
    return this.post<ApiResponse<number>>(`${this.basePath}/create`, data)
  }

  async deleteAccount(id: number): Promise<ApiResponse<boolean>> {
    // DELETE /api/v1/management-accounts/delete with body { id }
    return this.delete<ApiResponse<boolean>>(`${this.basePath}/delete`, { data: { id } })
  }

  // Assuming endpoint exists based on earlier curl
  async activate(userId: number, activate: boolean): Promise<ApiResponse<boolean>> {
    return this.post<ApiResponse<boolean>>('/accounts/activation', { userId, activate })
  }

  // Roles endpoint as per user request
  async getRoles(): Promise<ApiResponse<{ id: number; name: string; roleClaims: [] }[]>> {
    return this.get<ApiResponse<{ id: number; name: string; roleClaims: [] }[]>>(
      `${this.basePath}/roles`,
    )
  }

  async resetPassword(userId: number): Promise<ApiResponse<boolean>> {
    // Correct endpoint for Admin resetting password
    return this.post<ApiResponse<boolean>>(`${this.basePath}/reset-password`, { userId })
  }

  async changePassword(data: ChangePasswordInput): Promise<ApiResponse<boolean>> {
    return this.post<ApiResponse<boolean>>(`${this.basePath}/change-password`, data)
  }
}

interface ChangePasswordInput {
  oldPassword?: string
  newPassword?: string
  confirmNewPassword?: string
}

export const managementService = new ManagementAccountService()
