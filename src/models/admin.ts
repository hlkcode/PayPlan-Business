import type { Country } from './common'

export interface Company {
  id: number
  name: string
  email: string
  phoneNumber: string
  tin: string
  address: string
  countryId: number
  country?: Country
  isActive: boolean
  createdAt?: string
}

export interface UpdateCompanyInput {
  name?: string
  email?: string
  phoneNumber?: string
  tin?: string
  address?: string
  countryId?: number
}

export interface DocumentType {
  id: number
  name: string
}

export interface CreateDocumentTypeInput {
  name: string
}

export interface CountryDocument {
  id: number
  countryId: number
  country?: Country
  documentTypeId: number
  documentType?: DocumentType
  isRequired?: boolean // check docs
}

export interface CreateCountryDocumentInput {
  countryId: number
  documentTypeId: number
}

export interface CompanyDocument {
  id: number
  companyId: number
  documentTypeId: number
  documentUrl: string
  status: string // e.g. 'Pending', 'Approved'
}

export interface Request {
  id: number
  description: string
  createdBy: string
  updatedBy: string
  platform: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface CountryDocumentTypeView {
  id: number
  canExpire: boolean
  title: string
  documentTypeId: number
  documentTypeName: string
  countryId: number
  countryName: string
  createdAt: string
}

export interface RequestApprovalInput {
  id: number
  accpetedDocs?: number[]
  approve: boolean
  note?: string
}

export interface RequestDetail extends Request {
  // Add specific detail fields if known, otherwise it extends Request
  // Based on usage, might include documents or extended user info
  documents?: unknown[] // Todo: Define precise Document type if available
}
