import { FiFileText, FiXCircle } from "react-icons/fi";
import { SellerInfo } from "../../types/dashboard.types";
import Button from "@/components/ui/button/Button";
export function RejectedView({
  sellerInfo,
  navigateTo,
}: {
  sellerInfo: SellerInfo;
  navigateTo: (path: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 rounded-full">
            <FiXCircle className="text-3xl text-red-600" />
          </div>
        </div>
        <h2 className="mb-3 text-2xl font-semibold text-gray-800">
          Votre candidature nécessite une mise à jour
        </h2>
        <p className="mb-4 text-gray-600">
          Votre demande de compte vendeur n’a pas pu être validée. Pas
          d’inquiétude : vous pouvez facilement corriger vos informations et les
          renvoyer.
        </p>

        {sellerInfo.rejectionReason && (
          <div className="p-4 mb-6 text-left border border-red-200 rounded-lg bg-red-50">
            <h3 className="mb-2 font-medium text-red-800">Motif du refus :</h3>
            <p className="text-sm text-red-700">{sellerInfo.rejectionReason}</p>
          </div>
        )}

        <div className="p-4 mb-6 text-left border border-yellow-200 rounded-lg bg-yellow-50">
          <h3 className="flex items-center mb-2 font-medium text-yellow-800">
            <FiFileText className="mr-2" /> Comment régulariser
          </h3>
          <ul className="space-y-1 text-sm text-yellow-700">
            <li>• Consultez les critères dans votre espace vendeur</li>
            <li>• Téléversez à nouveau les documents corrigés ou manquants</li>
            <li>
              • Contactez notre support pour un accompagnement personnalisé
            </li>
          </ul>
        </div>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={() => navigateTo("/documents")}>
            Mettre à jour mes documents
          </Button>
          <Button variant="outline" onClick={() => navigateTo("/support")}>
            Contacter le support
          </Button>
        </div>
      </div>
    </div>
  );
}
