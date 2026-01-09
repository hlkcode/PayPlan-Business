import { BaseService } from '../BaseService'
import type { BusinessAccount, CreateBusinessAccountInput } from '@/models/account'
import type { ApiResponse, PaginatedList, PaginationDto } from '@/models/common'

class BusinessAccountService extends BaseService {
  private readonly basePath = '/business-accounts'

  async getAll(params: PaginationDto): Promise<ApiResponse<PaginatedList<BusinessAccount>>> {
    return this.get<ApiResponse<PaginatedList<BusinessAccount>>>(this.basePath, { params })
  }

  async create(data: CreateBusinessAccountInput): Promise<ApiResponse<number>> {
    return this.post<ApiResponse<number>>(`${this.basePath}`, data)
  }

  async deleteAccount(id: number): Promise<ApiResponse<boolean>> {
    return this.delete<ApiResponse<boolean>>(`${this.basePath}/delete`, { data: { id } })
  }

  async activate(userId: number, activate: boolean): Promise<ApiResponse<boolean>> {
    return this.post<ApiResponse<boolean>>('/accounts/activation', { userId, activate })
  }

  async changePassword(data: ChangePasswordInput): Promise<ApiResponse<boolean>> {
    return this.post<ApiResponse<boolean>>(`${this.basePath}/change-password`, data)
  }

  async login(
    data: BusinessLoginInput,
  ): Promise<ApiResponse<{ token: string; refreshToken: string; user: BusinessAccount }>> {
    return this.post<ApiResponse<{ token: string; refreshToken: string; user: BusinessAccount }>>(
      `${this.basePath}/login`,
      data,
    )
  }

  async sendCode(data: { phoneNumber: string }): Promise<ApiResponse<boolean>> {
    return this.post<ApiResponse<boolean>>(`${this.basePath}/code`, data)
  }

  async verifyCode(data: { phoneNumber: string; code: string }): Promise<ApiResponse<boolean>> {
    return this.post<ApiResponse<boolean>>(`${this.basePath}/verify`, data)
  }

  async resetPassword(userId: number): Promise<ApiResponse<boolean>> {
    return this.post<ApiResponse<boolean>>(`${this.basePath}/reset-password`, { userId })
  }

  async getRoles(): Promise<ApiResponse<{ id: number; name: string; roleClaims: [] }[]>> {
    return this.get<ApiResponse<{ id: number; name: string; roleClaims: [] }[]>>(
      `${this.basePath}/roles`,
    )
  }
}

interface ChangePasswordInput {
  oldPassword?: string
  newPassword?: string
  confirmNewPassword?: string
}

interface BusinessLoginInput {
  email?: string
  password?: string
}

export const businessService = new BusinessAccountService()
