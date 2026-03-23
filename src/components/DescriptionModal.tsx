import { useEffect } from "react";

interface Props {
  title: string;
  description: string;
  onClose: () => void;
}

export default function DescriptionModal({ title, description, onClose }: Props) {
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="description-modal-overlay" onClick={onClose}>
      <div className="description-modal" onClick={(e) => e.stopPropagation()}>
        <button className="description-modal-close" onClick={onClose}>
          ✕
        </button>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}
