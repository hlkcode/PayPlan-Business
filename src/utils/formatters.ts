export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatCurrency = (amount: number | null | undefined, currency = 'USD'): string => {
  if (amount === null || amount === undefined) return '-'
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
  }).format(amount)
}
