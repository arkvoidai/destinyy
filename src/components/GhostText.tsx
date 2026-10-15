import React from 'react';
import './GhostText.css';

export interface GhostTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export const GhostText: React.FC<GhostTextProps> = ({
  text,
  className = '',
  style,
}) => {
  return (
    <span
      className={`ark-ghost-text ${className}`.trim()}
      aria-hidden="true"
      style={style}
    >
      {text}
    </span>
  );
};
