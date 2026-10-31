// hooks/useAddressSelection.ts

import { useEffect, useMemo, useRef, useState } from "react";

import { Address } from "../types/types";

type Selection =
  | { type: "existing"; id: string }
  | { type: "new"; data: Address }
  | { type: "none" };

interface Props {
  addresses: Address[];
  addAddress: (address: Address) => void;
  onAddressSelect: (selection: Selection) => void;
}

export const useAddressSelection = ({
  addresses,
  addAddress,
  onAddressSelect,
}: Props) => {
  const [mode, setMode] =
    useState<"existing" | "new" | "none">("none");

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [showAllAddresses, setShowAllAddresses] =
    useState(false);

  const hasAutoSelected = useRef(false);

  useEffect(() => {
    if (hasAutoSelected.current) return;
    if (!addresses.length) return;

    const defaultAddress = addresses.find(
      (address) => address.isDefault,
    );

    if (!defaultAddress) return;

    hasAutoSelected.current = true;

    setSelectedId(defaultAddress._id);
    setMode("existing");

    onAddressSelect({
      type: "existing",
      id: defaultAddress._id,
    });
  }, [addresses, onAddressSelect]);

  const selectAddress = (id: string) => {
    setSelectedId(id);
    setMode("existing");

    onAddressSelect({
      type: "existing",
      id,
    });
  };

  const toggleNewAddress = () => {
    if (mode === "new") {
      setMode("none");
    } else {
      setMode("new");
    }

    setSelectedId(null);

    onAddressSelect({
      type: "none",
    });
  };

  const handleNewAddressSubmit = (data: Address) => {
    const address = {
      ...data,
      isDefault: false,
    };

    addAddress(address);

    setMode("existing");
    setSelectedId(address._id);

    onAddressSelect({
      type: "new",
      data: address,
    });
  };

  const toggleShowAll = () =>
    setShowAllAddresses((prev) => !prev);

  const firstAddress = useMemo(
    () => addresses.at(0) ?? null,
    [addresses],
  );

  const remainingAddresses = useMemo(
    () => addresses.slice(1),
    [addresses],
  );

  return {
    mode,
    selectedId,
    showAllAddresses,

    firstAddress,
    remainingAddresses,

    selectAddress,
    toggleNewAddress,
    toggleShowAll,
    handleNewAddressSubmit,
  };
};