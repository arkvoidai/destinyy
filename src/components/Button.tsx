import React, { forwardRef } from 'react';
import { Icon } from './Icon';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ember' | 'quiet';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
  variant?: ButtonVariant;
  href?: string;
  disabled?: boolean;
  children: React.ReactNode;
  trailingIcon?: React.ReactNode;
  hideTrailingIcon?: boolean;
  className?: string;
}

export const Button = forwardRef<HTMLElement, ButtonProps>(
  (
    {
      variant = 'primary',
      href,
      disabled = false,
      children,
      trailingIcon,
      hideTrailingIcon = false,
      className = '',
      type = 'button',
      ...rest
    },
    ref
  ) => {
    const isExternal =
      href &&
      (href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('//'));

    const classes = [
      'ark-btn',
      `variant-${variant}`,
      disabled ? 'is-disabled' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const renderChip = () => {
      if (hideTrailingIcon) return null;
      if (trailingIcon) {
        return (
          <span className="btn-chip" aria-hidden="true">
            {trailingIcon}
          </span>
        );
      }
      if (variant === 'primary') {
        return (
          <span className="btn-chip chip-ember" aria-hidden="true">
            <Icon name="arrow-up-right" size={16} />
          </span>
        );
      }
      if (variant === 'ember') {
        return (
          <span className="btn-chip chip-black" aria-hidden="true">
            <Icon name="arrow-up-right" size={16} />
          </span>
        );
      }
      return null;
    };

    const content = (
      <>
        <span className="btn-label">{children}</span>
        {renderChip()}
      </>
    );

    if (href && !disabled) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type as 'button' | 'submit' | 'reset'}
        className={classes}
        disabled={disabled}
        aria-disabled={disabled}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
