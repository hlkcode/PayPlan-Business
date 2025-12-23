export interface PaginationDto {
  pageNumber: number
  pageSize: number
  sortOrder?: string
  orderBy?: string
  search?: string
}

export interface ApiResponse<T> {
  isSuccess: boolean
  message: string
  data: T
}

export interface PaginatedList<T> {
  items: T[]
  totalCount: number
  currentPage: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface Country {
    id: number
    name: string
    code: string
    currency: string
}
