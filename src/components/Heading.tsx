import React from 'react';
import { SplitWords } from './SplitWords';
import { Ember, headingLabel } from './Ember';
import { Reveal } from './Reveal';
import './Heading.css';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
  text: string;
  italic?: string;
  ember?: boolean;
  theme?: string;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  level = 2,
  text,
  italic,
  ember = false,
  theme,
  className = '',
  ...rest
}) => {
  const Component = `h${level}` as React.ElementType;
  const isLong = text.length > 60;
  const accessibleLabel = ember ? headingLabel(text) : text;

  // Render text with optional italic section
  const renderContent = () => {
    if (!italic || !text.includes(italic)) {
      if (isLong) {
        return <span>{text}</span>;
      }
      return <SplitWords text={text} />;
    }

    const parts = text.split(italic);
    return (
      <>
        {parts[0] && (isLong ? parts[0] : <SplitWords text={parts[0]} />)}
        <em className="heading-italic">
          {isLong ? italic : <SplitWords text={italic} />}
        </em>
        {parts[1] && (isLong ? parts[1] : <SplitWords text={parts[1]} />)}
      </>
    );
  };

  const content = (
    <>
      {renderContent()}
      {ember && <Ember className="heading-ember-landing" />}
    </>
  );

  if (isLong) {
    return (
      <Reveal as={Component} reveal="rise-s" className={`ark-heading ${className}`.trim()} aria-label={accessibleLabel} {...rest}>
        {content}
      </Reveal>
    );
  }

  return (
    <Component
      data-theme={theme}
      aria-label={accessibleLabel}
      className={`ark-heading ${className}`.trim()}
      {...rest}
    >
      {content}
    </Component>
  );
};
