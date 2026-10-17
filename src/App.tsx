import React, { Suspense, useState, useRef } from 'react';
import { Header } from './components/chrome/Header';
import { MobileMenu } from './components/chrome/MobileMenu';
import { ScrollProgress } from './components/ScrollProgress';
import { BriefProvider } from './context/BriefContext';
import { WorldProvider } from './world/provider';
import { Hero } from './sections/Hero';
import { GlanceSection } from './sections/GlanceSection';
import { Manifesto } from './sections/Manifesto';
import { Ache } from './sections/Ache';
import { World } from './sections/World';
import { People } from './sections/People';
import { Engine } from './sections/Engine';
import { Realms } from './sections/Realms';
import { Device } from './sections/Device';
import { Plan } from './sections/Plan';
import { Bet } from './sections/Bet';
import { Founder } from './sections/Founder';

const LazyDemo = React.lazy(() => import('./sections/Demo'));

const DemoWrapper: React.FC = () => (
  <Suspense
    fallback={
      <div
        className="demo-fallback"
        style={{
          minHeight: '800px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--fg-muted)',
        }}
      >
        <span className="label">Loading Courtyard World Client...</span>
      </div>
    }
  >
    <LazyDemo />
  </Suspense>
);

export interface SectionDefinition {
  id: string;
  theme: 'void' | 'night' | 'deep' | 'dawn' | 'dawn-soft';
  label: string;
  Component: React.ComponentType;
}

export const SECTION_REGISTRY: SectionDefinition[] = [
  {
    id: 'top',
    theme: 'void',
    label: 'Hero',
    Component: Hero,
  },
  {
    id: 'features',
    theme: 'void',
    label: 'At a Glance',
    Component: GlanceSection,
  },
  {
    id: 'manifesto',
    theme: 'night',
    label: 'Manifesto',
    Component: Manifesto,
  },
  {
    id: 'ache',
    theme: 'void',
    label: 'The Ache',
    Component: Ache,
  },
  {
    id: 'world',
    theme: 'night',
    label: 'The World',
    Component: World,
  },
  {
    id: 'people',
    theme: 'dawn',
    label: 'The People',
    Component: People,
  },
  {
    id: 'prototype',
    theme: 'deep',
    label: 'The Demo',
    Component: DemoWrapper,
  },
  {
    id: 'engine',
    theme: 'dawn-soft',
    label: 'The Engine',
    Component: Engine,
  },
  {
    id: 'realms',
    theme: 'deep',
    label: 'The Realms',
    Component: Realms,
  },
  {
    id: 'device',
    theme: 'void',
    label: 'The Device',
    Component: Device,
  },
  {
    id: 'plan',
    theme: 'dawn',
    label: 'The Plan',
    Component: Plan,
  },
  {
    id: 'bet',
    theme: 'night',
    label: 'The Bet',
    Component: Bet,
  },
  {
    id: 'founder',
    theme: 'void',
    label: 'The Founder',
    Component: Founder,
  },
];

const LazyKitPage = React.lazy(() => import('./pages/KitPage'));

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);

  const isKit =
    typeof window !== 'undefined' && window.location.search.includes('kit');

  if (isKit) {
    return (
      <Suspense
        fallback={
          <div className="container" style={{ padding: 'var(--space-48)' }}>
            Loading QA Kit...
          </div>
        }
      >
        <LazyKitPage />
      </Suspense>
    );
  }

  return (
    <BriefProvider>
      <WorldProvider>
        {/* 1. Fixed Ember line at the very top */}
        <ScrollProgress />

        {/* 2. Top sentinel at 24px scroll depth for header bottom hairline */}
        <div
          id="header-top-sentinel"
          style={{
            position: 'absolute',
            top: '24px',
            left: 0,
            width: '1px',
            height: '1px',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />

        {/* 3. Global Header (desktop full bar, mobile floating pill) */}
        <Header
          isMenuOpen={isMenuOpen}
          onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
        />

        {/* 4. Full-screen Mobile Menu */}
        <MobileMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          triggerRef={menuTriggerRef}
        />

        {/* 5. Main Content Sections */}
        <main id="main-content" tabIndex={-1}>
          {SECTION_REGISTRY.map(({ id, theme, Component }) => (
            <div key={id} data-theme={theme} className="section-wrapper">
              <Component />
            </div>
          ))}
        </main>
      </WorldProvider>
    </BriefProvider>
  );
}
