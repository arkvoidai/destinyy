import React from 'react';
import './Logo.css';

export interface LogoMarkProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
  draw?: boolean;
  title?: string;
  className?: string;
}

export const LogoMark: React.FC<LogoMarkProps> = ({
  size = 40,
  draw = false,
  title,
  className = '',
  ...rest
}) => {
  const isHidden = !title;
  const height = typeof size === 'number' ? (size * 48) / 40 : size;

  return (
    <svg
      viewBox="0 0 40 48"
      width={size}
      height={height}
      fill="none"
      aria-hidden={isHidden}
      role={title ? 'img' : undefined}
      className={`logo-mark ${draw ? 'is-drawing' : ''} ${className}`.trim()}
      {...rest}
    >
      {title && <title>{title}</title>}
      {/* Outer arch */}
      <path
        d="M7 46V20C7 10.5 12.8 4 20 4s13 6.5 13 16v26"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        fill="none"
        pathLength="1"
        className="outer-arch"
      />
      {/* Inner arch */}
      <path
        d="M13.5 46V21.5c0-6 2.9-10.5 6.5-10.5s6.5 4.5 6.5 10.5V46"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.55"
        fill="none"
        pathLength="1"
        className="inner-arch"
      />
      {/* Ember circle */}
      <circle
        cx="20"
        cy="31"
        r="3.1"
        fill="var(--ember)"
        stroke="none"
        className="ember-circle"
      />
    </svg>
  );
};

export interface LogoLockupProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | string;
  draw?: boolean;
  title?: string;
  className?: string;
}

export const LogoLockup: React.FC<LogoLockupProps> = ({
  size = 32,
  draw = false,
  title = 'Arkvoid',
  className = '',
  ...rest
}) => {
  return (
    <div className={`logo-lockup ${className}`.trim()} {...rest}>
      <LogoMark size={size} draw={draw} title={title} />
      <span className="logo-wordmark">Arkvoid</span>
    </div>
  );
};
