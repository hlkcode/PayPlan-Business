import type { Country } from './common'

export interface BaseAccount {
    id: number
    email: string
    phoneNumber: string
    isActive: boolean
    verificationStatus?: string
    country?: Country
}

export interface ManagementAccount extends BaseAccount {
    surname: string
    otherNames: string
    role: string
    platform: string
}

export interface PersonalAccount extends BaseAccount {
    surname: string
    otherNames: string
}

export interface BusinessAccount extends BaseAccount {
    companyName: string
    tin: string
    address: string
}

export interface CreateManagementAccountInput {
    email: string
    role: string
    surname: string
    otherNames: string
    phoneNumber: string
    countryId: number
}
