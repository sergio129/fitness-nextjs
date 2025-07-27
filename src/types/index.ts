export interface Admin {
  id: string
  email: string
  password: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export enum MembershipType {
  MONTHLY = "MONTHLY",
  ANNUAL = "ANNUAL"
}

export enum PaymentType {
  MONTHLY = "MONTHLY",
  ANNUAL = "ANNUAL",
  REGISTRATION = "REGISTRATION",
  PENALTY = "PENALTY",
  OTHER = "OTHER"
}

export enum AlertType {
  PAYMENT_DUE_SOON = "PAYMENT_DUE_SOON",
  PAYMENT_OVERDUE = "PAYMENT_OVERDUE",
  MEMBER_INACTIVE = "MEMBER_INACTIVE"
}

export interface Member {
  id: string
  firstName: string
  lastName: string
  document: string
  email?: string
  phone?: string
  address?: string
  birthDate?: Date
  registrationDate: Date
  membershipType: MembershipType
  lastPaymentDate?: Date
  nextPaymentDate?: Date
  isActive: boolean
  monthlyFee: number
  notes?: string
  createdAt: Date
  updatedAt: Date
  payments?: Payment[]
  _count?: {
    payments: number
  }
}

export interface Payment {
  id: string
  memberId: string
  amount: number
  paymentDate: Date
  paymentType: PaymentType
  description?: string
  createdAt: Date
  updatedAt: Date
  member?: {
    id: string
    firstName: string
    lastName: string
    document: string
  }
}
