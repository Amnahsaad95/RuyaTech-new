// src/components/IconButton.tsx
import React from 'react';

interface IconButtonProps {
  icon: string;
  label: string;
  active?: boolean;
  onClick: () => void;
}

export function IconButton({ icon, label, active = false, onClick }: IconButtonProps) {
  return (
    <button
      className={`icon-button ${active ? 'active' : ''}`}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}
