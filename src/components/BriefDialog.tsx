import React from 'react';
import { Dialog } from './Dialog';
import { Icon } from './Icon';
import { copy } from '../data/copy';
import { siteConfig } from '../config/site';
import './BriefDialog.css';

export interface BriefDialogProps {
  open: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export const BriefDialog: React.FC<BriefDialogProps> = ({
  open,
  onClose,
  triggerRef,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      titleId="brief-title"
      title={copy.brief.title}
      className="brief-dialog"
      triggerRef={triggerRef}
    >
      <div data-theme="night" className="brief-content-wrap">
        {/* Six Blocks as Numbered List */}
        <ol className="brief-blocks-list">
          {copy.brief.blocks.map((block, idx) => {
            const numeral = `0${idx + 1}`;
            return (
              <li key={block.t} className="brief-block-item">
                <span className="brief-numeral" aria-hidden="true">
                  {numeral}
                </span>
                <div className="brief-block-content">
                  <h3 className="brief-block-title display-3">{block.t}</h3>
                  <p className="brief-block-desc body">{block.d}</p>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Footer Row: Email mailto, X link, Close button */}
        <div className="brief-footer-row">
          <div className="brief-footer-links">
            <a
              href={`mailto:${siteConfig.email}`}
              className="brief-link-pill"
            >
              <Icon name="mail" size={14} />
              <span>{siteConfig.email}</span>
            </a>

            <a
              href={siteConfig.xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="brief-link-pill"
            >
              <span>{siteConfig.xHandle}</span>
              <Icon name="arrow-up-right" size={14} />
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="brief-close-pill-btn"
          >
            {copy.brief.close}
          </button>
        </div>
      </div>
    </Dialog>
  );
};
