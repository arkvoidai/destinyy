import React from 'react';
import './Glass.css';

export interface GlassProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  tone?: 'dark' | 'light' | 'inverse';
  radius?: 'md' | 'lg' | 'xl';
  padded?: boolean;
  interactive?: boolean;
  blur?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Glass: React.FC<GlassProps> = ({
  as: Component = 'div',
  tone = 'dark',
  radius = 'md',
  padded = false,
  interactive = false,
  blur = false,
  className = '',
  children,
  ...rest
}) => {
  const classes = [
    'ark-glass',
    `tone-${tone}`,
    `radius-${radius}`,
    padded ? 'is-padded' : '',
    interactive ? 'interactive' : '',
    blur ? 'has-blur' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
};
