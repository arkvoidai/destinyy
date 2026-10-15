import React from 'react';
import './Ember.css';

export interface EmberProps {
  className?: string;
}

export const Ember: React.FC<EmberProps> = ({ className = '' }) => {
  return (
    <span className={`ember-dot ${className}`.trim()} aria-hidden="true">
      .
    </span>
  );
};

/**
 * Returns clean accessible label for headings ending with the Ember mark.
 */
export function headingLabel(text: string): string {
  if (text.endsWith('.')) return text;
  return `${text}.`;
}
