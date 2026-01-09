import type { Country } from './common'

export interface Company {
  id: number
  companyId?: number // For business account endpoint
  name: string
  email: string
  phoneNumber: string
  tin: string
  address: string
  countryId: number
  country?: Country
  isActive: boolean
  userRoleInCompany?: string
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
  companyId?: number // inferred
  documentTypeId?: number // might not be in response, checking... response shows 'name' not 'documentTypeId'
  url: string
  expiryDate: string
  name: string
  createdBy: string
  createdAt: string
  updatedAt: string | null
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

export interface InviteUsersToCompanyInput {
  email: string
  role: string
  companyId: number
}

export interface Invite {
  id: number
  email: string
  role: string
  status: string
  companyId: number
  createdById: number
  updatedById: number | null
  createdBy: string
  updatedBy: string | null
  createdAt: string
  updatedAt: string | null
}
export interface CompanyUser {
  userId: number
  phoneNumber: string
  surname: string
  otherNames: string
  email: string
  statusInCompany: boolean
  role: string
  createdAt: string
  updatedAt: string | null
}

export interface DocumentType {
  documentTypeId: number
  canExpire: boolean
  title: string
}

export interface DocFileUploadEntry {
  documentTypeId: number
  file: File
  expiryDate?: string
}
