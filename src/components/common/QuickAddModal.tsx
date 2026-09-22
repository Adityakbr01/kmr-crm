import React, { useEffect } from "react";
import { Plus, X } from "lucide-react";

interface QuickAddModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}

/**
 * Small overlay dialog used for in-place ("Add New") creation.
 * The parent form stays mounted underneath, so no form state is lost.
 * Closes on backdrop click or the Escape key.
 */
const QuickAddModal: React.FC<QuickAddModalProps> = ({
  title,
  onClose,
  children,
  wide = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full ${
          wide ? "max-w-3xl" : "max-w-md"
        } bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-xl">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

interface AddNewButtonProps {
  onClick: () => void;
  label?: string;
}

/** Inline "+ Add New" trigger placed next to a dropdown label. */
export const AddNewButton: React.FC<AddNewButtonProps> = ({
  onClick,
  label = "Add New",
}) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-1 text-xs font-semibold text-accent-600 hover:text-accent-700 transition-colors"
  >
    <Plus className="w-3.5 h-3.5" />
    {label}
  </button>
);

interface FieldLabelWithAddProps {
  label: string;
  required?: boolean;
  onAdd: () => void;
  addLabel?: string;
}

/** Label row with an inline "Add New" action on the right. */
export const FieldLabelWithAdd: React.FC<FieldLabelWithAddProps> = ({
  label,
  required = false,
  onAdd,
  addLabel,
}) => (
  <div className="flex items-center justify-between mb-2">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-700">*</span>}
    </label>
    <AddNewButton onClick={onAdd} label={addLabel} />
  </div>
);

export default QuickAddModal;
