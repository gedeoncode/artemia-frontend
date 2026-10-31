export type CommissionModel = "PAP" | "PAL";

interface SellerModeMessageOptions {
  sellerMode: CommissionModel;
  preferredAllowedMode: CommissionModel | null;
}

export function getSellerModeMessage({
  sellerMode,
  preferredAllowedMode,
}: SellerModeMessageOptions): string {
  const modeDescriptions: Record<CommissionModel, string> = {
    PAP: "PAP (Paiement à la Publication) : la commission est réglée avant la mise en ligne",
    PAL: "PAL (Paiement à la Livraison) : la commission est déduite automatiquement après la livraison",
  };

  return `Votre mode actuel est ${modeDescriptions[sellerMode]}.

La catégorie sélectionnée fonctionne uniquement avec le mode ${modeDescriptions[preferredAllowedMode]}.

Souhaitez-vous passer en ${preferredAllowedMode} pour continuer la publication ?`;
}
