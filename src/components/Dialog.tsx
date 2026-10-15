import React, { useEffect, useRef, useState } from 'react';
import { copy } from '../data/copy';
import { Icon } from './Icon';
import './Dialog.css';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  titleId: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  titleId,
  title,
  children,
  className = '',
  triggerRef,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      openerRef.current =
        triggerRef?.current || (document.activeElement as HTMLElement | null);
      setIsClosing(false);
      if (!dialog.open) {
        dialog.showModal();
      }
      document.documentElement.classList.add('has-dialog-open');
    } else if (dialog.open) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        dialog.close();
        setIsClosing(false);
        document.documentElement.classList.remove('has-dialog-open');
        if (openerRef.current) {
          openerRef.current.focus();
        }
      }, 160);
      return () => clearTimeout(timer);
    }
  }, [open, triggerRef]);

  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onClose();
  };

  const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;

    if (!isInDialog) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className={`ark-dialog ${isClosing ? 'is-closing' : ''} ${className}`.trim()}
      onCancel={handleCancel}
      onClick={handleClick}
    >
      <div className="dialog-window">
        <header className="dialog-header">
          <h2 id={titleId} className="dialog-title display-3">
            {title}
          </h2>
          <button
            type="button"
            className="dialog-close-btn"
            onClick={onClose}
            aria-label={copy.ui.closeDialog}
          >
            <Icon name="close" size={20} />
          </button>
        </header>

        <div className="dialog-body">{children}</div>
      </div>
    </dialog>
  );
};
