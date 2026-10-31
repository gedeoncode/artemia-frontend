"use client";
import React from "react";

interface CharacterCounterProps {
  current: number;
  max: number;
  className?: string;
}

export function CharacterCounter({ current, max, className }: CharacterCounterProps) {
  const ratio = current / max;
  const color =
    ratio > 1
      ? "text-red-600"
      : ratio > 0.8
        ? "text-amber-600"
        : "text-gray-500";

  return (
    <span className={`text-xs ${color} ${className || ""}`}>
      {current}/{max}
    </span>
  );
}
