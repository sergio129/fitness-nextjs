export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getPaymentTypeName = (type: string): string => {
  const types: Record<string, string> = {
    MONTHLY: 'Mensual',
    ANNUAL: 'Anual', 
    REGISTRATION: 'Inscripción',
    PENALTY: 'Multa',
    OTHER: 'Otro',
  };
  return types[type] || type;
};

export const getMembershipTypeName = (type: string): string => {
  const types: Record<string, string> = {
    MONTHLY: 'Mensual',
    ANNUAL: 'Anual',
  };
  return types[type] || type;
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatShortDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('es-CO');
};
