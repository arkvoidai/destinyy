import React from 'react';
import './Icon.css';

export type IconName =
  | 'arrow-up-right'
  | 'menu'
  | 'close'
  | 'plus'
  | 'minus'
  | 'door'
  | 'world'
  | 'layers'
  | 'check'
  | 'clock'
  | 'scroll'
  | 'mail'
  | 'copy'
  | 'x-social'
  | 'shield'
  | 'spark'
  | 'eye'
  | 'gauge'
  | 'ember-dot';

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  title?: string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  title,
  className = '',
  ...rest
}) => {
  const isHidden = !title;

  const renderPath = () => {
    switch (name) {
      case 'arrow-up-right':
        return <path d="M7 17L17 7M17 7H8M17 7V16" />;
      case 'menu':
        return <path d="M4 6h16M4 12h16M4 18h16" />;
      case 'close':
        return <path d="M6 6l12 12M18 6L6 18" />;
      case 'plus':
        return <path d="M12 5v14M5 12h14" />;
      case 'minus':
        return <path d="M5 12h14" />;
      case 'door':
        return (
          <>
            <path d="M6 21V9a6 6 0 0 1 12 0v12M4 21h16" />
            <circle cx="15" cy="13" r="1" fill="currentColor" stroke="none" />
          </>
        );
      case 'world':
        return (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3a13 13 0 0 0 0 18M12 3a13 13 0 0 1 0 18M3 12h18" />
          </>
        );
      case 'layers':
        return (
          <>
            <path d="M12 3l8 4-8 4-8-4 8-4z" />
            <path d="M4 11l8 4 8-4" />
            <path d="M4 15.5l8 4 8-4" />
          </>
        );
      case 'check':
        return (
          <>
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <path d="M8.5 12.5l2.5 2.5 4.5-5" />
          </>
        );
      case 'clock':
        return (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3.5 2" />
          </>
        );
      case 'scroll':
        return (
          <path d="M19 17V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2zM5 17h12a2 2 0 0 1 2 2" />
        );
      case 'mail':
        return (
          <>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </>
        );
      case 'copy':
        return (
          <>
            <rect x="8" y="8" width="13" height="13" rx="2" />
            <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
          </>
        );
      case 'x-social':
        return <path d="M5 5l14 14M19 5L5 19" />;
      case 'shield':
        return <path d="M12 3l8 4v5c0 5.5-3.5 9-8 10-4.5-1-8-4.5-8-10V7l8-4z" />;
      case 'spark':
        return (
          <path d="M12 2Q12 12 2 12Q12 12 12 22Q12 12 22 12Q12 12 12 2Z" />
        );
      case 'eye':
        return (
          <>
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
          </>
        );
      case 'gauge':
        return (
          <>
            <path d="M4 16a8 8 0 1 1 16 0" />
            <path d="M3 17h18" />
            <path d="M12 16l3-5.5" />
            <circle cx="12" cy="16" r="1.5" fill="currentColor" />
          </>
        );
      case 'ember-dot':
        return <circle cx="12" cy="12" r="5" fill="currentColor" stroke="none" />;
    }
  };

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={isHidden}
      role={title ? 'img' : undefined}
      className={`ark-icon ${className}`.trim()}
      {...rest}
    >
      {title && <title>{title}</title>}
      {renderPath()}
    </svg>
  );
};
