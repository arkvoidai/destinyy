import React from 'react';
import { copy } from '../data/copy';
import { useMedia } from '../hooks/useMedia';
import { useFinePointer } from '../hooks/useFinePointer';
import './DeviceFrame.css';

export interface DeviceFrameProps {
  label: string;
  maxHeight?: string | number;
  children: React.ReactNode;
  className?: string;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  label,
  maxHeight = '640px',
  children,
  className = '',
}) => {
  const isDesktop = useMedia('(min-width: 960px)');
  const isFinePointer = useFinePointer();
  const shouldRenderFrame = isDesktop && isFinePointer;

  if (!shouldRenderFrame) {
    return <div className={`device-flat-view ${className}`.trim()}>{children}</div>;
  }

  const heightValue = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;

  return (
    <div
      className={`device-frame-outer ${className}`.trim()}
      role="region"
      aria-label={label}
    >
      {/* 84x24 island pill */}
      <div className="device-island-pill" aria-hidden="true">
        <span className="island-lens" />
      </div>

      {/* Scrollable inner viewport */}
      <div
        className="device-inner-screen"
        tabIndex={0}
        aria-label={`${label} ${copy.ui.deviceDisplayArea}`}
        style={{ maxHeight: heightValue }}
      >
        {children}
      </div>
    </div>
  );
};
