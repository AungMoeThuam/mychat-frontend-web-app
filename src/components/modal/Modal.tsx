import { createPortal } from "react-dom";

interface ModalProps {
  children: React.ReactNode; // Define the type for children
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  // Check if the element exists before creating the portal
  const portal = document.getElementById("portal");

  // Ensure the portal exists before rendering the content
  return portal
    ? createPortal(
        <div
          onClick={onClose}
          style={{ zIndex: 15 }}
          className="absolute bottom-0  bg-opacity-70  left-0 right-0 top-0 flex flex-col justify-center items-center  p-2  bg-slate-900"
        >
          {children}
        </div>,
        portal
      )
    : null;
}
