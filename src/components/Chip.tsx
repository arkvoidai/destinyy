import React from 'react';
import { Icon } from './Icon';
import './Chip.css';

export type ChipVariant = 'solid' | 'glass' | 'outline';
export type ChipDotKind = 'now' | 'next' | 'then' | 'rejected';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant;
  dot?: ChipDotKind;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Chip: React.FC<ChipProps> = ({
  variant = 'glass',
  dot,
  children,
  className = '',
  as: Component = 'span',
  ...rest
}) => {
  const classes = [
    'ark-chip',
    `variant-${variant}`,
    dot ? `has-dot dot-${dot}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const renderDot = () => {
    if (!dot) return null;
    if (dot === 'rejected') {
      return (
        <span className="chip-dot dot-glyph" aria-hidden="true">
          <Icon name="close" size={10} />
        </span>
      );
    }
    return <span className={`chip-dot dot-${dot}`} aria-hidden="true" />;
  };

  return (
    <Component className={classes} {...rest}>
      {renderDot()}
      <span className="chip-label">{children}</span>
    </Component>
  );
};
