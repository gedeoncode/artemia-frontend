export const sidebarTranslations: Record<string, Record<string, string>> = {
  fr: {
    dashboard: "Tableau de bord",
    manageProducts: "Gérer les produits",
    orders: "Commandes",
    invoices: "Factures",
    profile: "Profil",
    addProduct: "Ajouter un produit",
    home: "Retour au site",
    support: "Support",
    logout: "Déconnexion",
    hoverOn: "✅ Aperçu au survol: ON",
    hoverOff: "❌ Aperçu au survol: OFF",
    compactOn: "✅ Mode compact: ON",
    compactOff: "❌ Mode compact: OFF",
  },
  en: {
    dashboard: "Dashboard",
    manageProducts: "Manage Products",
    orders: "Orders",
    invoices: "Invoices",
    profile: "Profile",
    addProduct: "Add Product",
    home: "Back to Site",
    support: "Support",
    logout: "Logout",
    hoverOn: "✅ Hover preview: ON",
    hoverOff: "❌ Hover preview: OFF",
    compactOn: "✅ Compact mode: ON",
    compactOff: "❌ Compact mode: OFF",
  },
};

export const translate = (locale: string, key: string) => {
  return sidebarTranslations[locale]?.[key] ?? key;
};

