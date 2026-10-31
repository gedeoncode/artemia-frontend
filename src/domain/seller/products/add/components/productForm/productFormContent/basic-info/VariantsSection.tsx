import { FiPlus, FiTrash2 } from "react-icons/fi";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { ProductFormData } from "../../../../../types/product.types";

export const VariantsSection = () => {
  const { register, control } = useFormContext<ProductFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Variantes du produit
        </label>
        <p className="mt-1 text-sm text-gray-500">
          Ajoutez des options comme la taille ou la couleur
        </p>

        <div className="mt-4 space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 space-y-3 rounded-md bg-gray-50">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom de l'option
                </label>
                <input
                  type="text"
                  {...register(`variants.${index}.option` as const, {
                    required: "Le nom de l'option est requis",
                  })}
                  defaultValue={field.option}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="ex : Taille, Couleur"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Valeurs de l'option (séparées par des virgules)
                </label>
                <input
                  type="text"
                  {...register(`variants.${index}.valuesString` as const)}
                  defaultValue={field.values?.join(", ")}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="ex : Petit, Moyen, Grand"
                />
              </div>

              <button
                type="button"
                onClick={() => remove(index)}
                className="flex items-center text-red-600 hover:text-red-900"
              >
                <FiTrash2 className="mr-1" /> Supprimer cette variante
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ option: "", values: [] })}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <FiPlus className="mr-1" /> Ajouter une variante
          </button>
        </div>
      </div>
    </div>
  );
};
