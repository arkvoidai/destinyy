import React from 'react';
import './Section.css';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  theme: 'void' | 'night' | 'deep' | 'dawn' | 'dawn-soft';
  labelledBy: string;
  sheet?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({
  id,
  theme,
  labelledBy,
  sheet = false,
  children,
  className = '',
  ...rest
}) => {
  return (
    <section
      id={id}
      data-theme={theme}
      aria-labelledby={labelledBy}
      className={`ark-section ${sheet ? 'sheet' : ''} ${className}`.trim()}
      {...rest}
    >
      {children}
    </section>
  );
};
