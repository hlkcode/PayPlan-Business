import type { Country } from './common'

export interface BaseAccount {
  id: number
  email: string
  phoneNumber: string
  isActive: boolean
  verificationStatus?: string
  country?: Country
}

export interface BusinessAccount extends BaseAccount {
  companyName: string
  tin: string
  address: string
}

export interface CreateBusinessAccountInput {
  email: string
  password?: string
  companyName: string
  tin: string
  phoneNumber: string
  address: string
  countryId: number
}
