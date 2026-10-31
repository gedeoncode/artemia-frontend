const SELLER = "/seller";

export const ROUTES = {
  DASHBOARD: `${SELLER}/dashboard`,
  SUPPORT: `${SELLER}/support`,
  PROFILE: `${SELLER}/profile`,

  PRODUCTS: {
    LIST: `${SELLER}/products`,
    ADD: `${SELLER}/products/add`,
    VIEW: (id: string) => `${SELLER}/products/${id}`,
    EDIT: (id: string) => `${SELLER}/products/${id}/edit`,
  },

  LEADS: {
    LIST: `${SELLER}/leads`,
    VIEW: (id: string) => `${SELLER}/leads/${id}`,
    EDIT: (id: string) => `${SELLER}/leads/${id}/edit`,
  },
  INVOICES: {
    LIST: `${SELLER}/invoices`,
    VIEW: (id: string) => `${SELLER}/leads/${id}`,
  },

  ORDERS: {
    LIST: `${SELLER}/orders`,
    VIEW: (id: string) => `${SELLER}/orders/${id}`,
  },
} as const;