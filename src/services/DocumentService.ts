import { BaseService } from './BaseService'
import type {
  DocumentType,
  CreateDocumentTypeInput,
  CountryDocument,
  CreateCountryDocumentInput,
} from '@/models/admin'
import type { ApiResponse, PaginatedList, PaginationDto } from '@/models/common'

class DocumentService extends BaseService {
  // Document Types
  async getTypes(params: PaginationDto): Promise<ApiResponse<PaginatedList<DocumentType>>> {
    return this.get<ApiResponse<PaginatedList<DocumentType>>>('/DocumentTypes', { params })
  }

  async createType(data: CreateDocumentTypeInput): Promise<ApiResponse<number>> {
    return this.post<ApiResponse<number>>('/DocumentTypes', data)
  }

  async updateType(id: number, data: CreateDocumentTypeInput): Promise<ApiResponse<boolean>> {
    return this.put<ApiResponse<boolean>>(`/DocumentTypes/${id}`, data)
  }

  async deleteType(id: number): Promise<ApiResponse<boolean>> {
    return this.delete<ApiResponse<boolean>>(`/DocumentTypes/${id}`)
  }

  // Country Documents (Linking)
  async getCountryDocuments(
    params: PaginationDto,
  ): Promise<ApiResponse<PaginatedList<CountryDocument>>> {
    // Docs: GET /api/CountryDocuments
    return this.get<ApiResponse<PaginatedList<CountryDocument>>>('/CountryDocuments', { params })
  }

  async createCountryDocument(data: CreateCountryDocumentInput): Promise<ApiResponse<number>> {
    return this.post<ApiResponse<number>>('/CountryDocuments', data)
  }

  async updateCountryDocument(
    id: number,
    data: CreateCountryDocumentInput,
  ): Promise<ApiResponse<boolean>> {
    return this.put<ApiResponse<boolean>>(`/CountryDocuments/${id}`, data)
  }

  async deleteCountryDocument(id: number): Promise<ApiResponse<boolean>> {
    return this.delete<ApiResponse<boolean>>(`/CountryDocuments/${id}`)
  }
}

export const documentService = new DocumentService()
