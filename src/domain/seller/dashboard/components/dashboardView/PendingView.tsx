import { FiAlertTriangle, FiClock } from "react-icons/fi";
import { SellerInfo } from "../../types/dashboard.types";
import { Button } from "@/components/ui/button/Button";

export function PendingView({ sellerInfo }: { sellerInfo: SellerInfo }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center ">
          <div className="p-4 bg-yellow-100 rounded-full">
            <FiClock className="text-3xl text-yellow-600" />
          </div>
        </div>
        <h2 className="mb-3 text-2xl font-semibold text-gray-800">
          Votre compte est en cours de vérification
        </h2>
        <p className="mb-6 text-gray-600">
          Merci d’avoir soumis vos informations 🎉 Notre équipe procède
          actuellement à leur validation. Cette étape prend généralement entre{" "}
          <strong>24 et 48h</strong>.
        </p>

        <div className="p-4 mb-6 text-left border border-blue-200 rounded-lg bg-blue-50">
          <h3 className="flex items-center mb-2 font-medium text-blue-800">
            <FiAlertTriangle className="mr-2" /> Prochaines étapes
          </h3>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• Vous recevrez un e-mail dès que votre compte sera activé</li>
            <li>• Consultez vos notifications pour suivre l’avancement</li>
            <li>• Vérifiez que vos coordonnées sont bien à jour</li>
          </ul>
        </div>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={() => (window.location.href = "/support")}>
            Contacter le support
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Rafraîchir le statut
          </Button>
        </div>
      </div>
    </div>
  );
}
