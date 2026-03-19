"use client";

import React from "react";
import { ContactRound, Trash } from "lucide-react";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

export default function ActionButtons({ onEdit, onDelete }: Props) {
  return (
    <div className="flex gap-2">
      <button className="cursor-pointer" onClick={onEdit}>
        <ContactRound size={16} />
      </button>

      <button className="cursor-pointer" onClick={onDelete}>
        <Trash size={16} />
      </button>
    </div>
  );
}
