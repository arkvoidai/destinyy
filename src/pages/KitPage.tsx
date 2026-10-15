import { useState, useRef } from 'react';
import { Section } from '../components/Section';
import { Container } from '../components/Container';
import { Button } from '../components/Button';
import { Chip, type ChipDotKind, type ChipVariant } from '../components/Chip';
import { Glass } from '../components/Glass';
import { Icon, type IconName } from '../components/Icon';
import { Tabs } from '../components/Tabs';
import { GhostText } from '../components/GhostText';
import { DeviceFrame } from '../components/DeviceFrame';
import { SceneImage } from '../components/SceneImage';
import { Dialog } from '../components/Dialog';
import { LogoMark, LogoLockup } from '../components/brand/Logo';
import { Ember } from '../components/Ember';
import { Reveal } from '../components/Reveal';
import { SplitWords } from '../components/SplitWords';
import { Heading } from '../components/Heading';
import { ScrollProgress } from '../components/ScrollProgress';
import './KitPage.css';

const ALL_ICONS: IconName[] = [
  'arrow-up-right',
  'menu',
  'close',
  'plus',
  'minus',
  'door',
  'world',
  'layers',
  'check',
  'clock',
  'scroll',
  'mail',
  'copy',
  'x-social',
  'shield',
  'spark',
  'eye',
  'gauge',
  'ember-dot',
];

const THEMES = ['void', 'night', 'deep', 'dawn', 'dawn-soft'] as const;

export default function KitPage() {
  const [selectedTheme, setSelectedTheme] = useState<(typeof THEMES)[number]>('void');
  const [dialogOpen, setDialogOpen] = useState(false);
  const dialogTriggerRef = useRef<HTMLButtonElement>(null);

  const tabItems = [
    {
      id: 'tab-valley',
      label: 'Cultivation Valley',
      content: (
        <p className="body">
          The valley clock records continuous solar shifts. Disciple Lin tends the medicinal orchid beds.
        </p>
      ),
    },
    {
      id: 'tab-engine',
      label: 'Rule Engine',
      content: (
        <p className="body">
          Actions are proposed by inhabitant agents and verified against deterministic world covenants.
        </p>
      ),
    },
    {
      id: 'tab-archives',
      label: 'Permanent Archives',
      content: (
        <p className="body">
          Elder Wu inscribes verified encounters on treated wood tablets. Memories derive strictly from the log.
        </p>
      ),
    },
  ];

  return (
    <div className="kit-page" data-theme={selectedTheme}>
      <header className="kit-header">
        <Container>
          <div className="kit-header-row">
            <div>
              <span className="label">Arkvoid Design Systems</span>
              <h1 className="display-2">Component QA Kit</h1>
            </div>
            <div className="theme-switcher" role="group" aria-label="Select Theme">
              <span className="label">Active Theme:</span>
              <div className="theme-pills">
                {THEMES.map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    className={`theme-pill ${selectedTheme === theme ? 'is-active' : ''}`}
                    onClick={() => setSelectedTheme(theme)}
                    aria-pressed={selectedTheme === theme}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </header>

      <main className="kit-content">
        {/* 0. BRAND & EMBER */}
        <Section id="kit-brand" theme={selectedTheme} labelledBy="brand-title">
          <Container>
            <h2 id="brand-title" className="display-3">
              Brand & Ember Gate<Ember />
            </h2>
            <p className="lead">
              The Ember Gate mark (40x48 viewBox), Newsreader wordmark, and the accent Ember full stop.
            </p>

            <div className="kit-row" style={{ alignItems: 'center' }}>
              <div className="kit-item">
                <span className="label">LogoLockup (32px)</span>
                <LogoLockup size={32} />
              </div>
              <div className="kit-item">
                <span className="label">LogoMark (48px, Draw Animation)</span>
                <LogoMark size={40} draw={true} />
              </div>
              <div className="kit-item">
                <span className="label">Small Mark (16px)</span>
                <LogoMark size={16} />
              </div>
              <div className="kit-item">
                <span className="label">Large Mark (72px)</span>
                <LogoMark size={72} />
              </div>
            </div>
          </Container>
        </Section>

        {/* 1. BUTTONS */}
        <Section id="kit-buttons" theme={selectedTheme} labelledBy="btn-title">
          <Container>
            <h2 id="btn-title" className="display-3">Buttons</h2>
            <p className="lead">56px pill buttons across variants and interactive states.</p>

            <div className="kit-row">
              <div className="kit-item">
                <span className="label">Primary</span>
                <Button variant="primary">Enter Valley</Button>
              </div>
              <div className="kit-item">
                <span className="label">Secondary</span>
                <Button variant="secondary">Inspect Ledger</Button>
              </div>
              <div className="kit-item">
                <span className="label">Ember (Finale)</span>
                <Button variant="ember">Earn Platform</Button>
              </div>
              <div className="kit-item">
                <span className="label">Quiet</span>
                <Button variant="quiet">Read Genesis Note</Button>
              </div>
              <div className="kit-item">
                <span className="label">Disabled</span>
                <Button variant="primary" disabled>Locked Gate</Button>
              </div>
            </div>
          </Container>
        </Section>

        {/* 2. CHIPS */}
        <Section id="kit-chips" theme={selectedTheme} labelledBy="chip-title">
          <Container>
            <h2 id="chip-title" className="display-3">Chips</h2>
            <p className="lead">Pill badges with accessible dot variants (never color alone).</p>

            <div className="kit-row">
              {(['now', 'next', 'then', 'rejected'] as ChipDotKind[]).map((dot) => (
                <div key={dot} className="kit-item">
                  <span className="label">Dot: {dot}</span>
                  <div className="chip-stack">
                    {(['solid', 'glass', 'outline'] as ChipVariant[]).map((v) => (
                      <Chip key={v} variant={v} dot={dot}>
                        {v} status
                      </Chip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* 3. TABS */}
        <Section id="kit-tabs" theme={selectedTheme} labelledBy="tabs-title">
          <Container>
            <h2 id="tabs-title" className="display-3">Segmented Tabs</h2>
            <p className="lead">Accessible roving tabindex with sliding indicator and mobile scroll.</p>
            <div className="tabs-kit-box">
              <Tabs items={tabItems} label="Valley subsystems" />
            </div>
          </Container>
        </Section>

        {/* 4. GLASS */}
        <Section id="kit-glass" theme={selectedTheme} labelledBy="glass-title">
          <Container>
            <h2 id="glass-title" className="display-3">Glass Panels</h2>
            <p className="lead">Polymorphic surfaces with solid fallback and inverse tones.</p>

            <div className="kit-grid-3">
              <Glass tone="dark" radius="md" padded interactive>
                <span className="label">Dark Tone (Interactive)</span>
                <p className="body">Standard glass surface responding to hover and press.</p>
              </Glass>
              <Glass tone="light" radius="lg" padded blur>
                <span className="label">Light Tone (Blur)</span>
                <p className="body">Translucent surface with desktop blur saturation.</p>
              </Glass>
              <Glass tone="inverse" radius="xl" padded interactive>
                <span className="label">Inverse Tone</span>
                <p className="body">Surface swapping to opposite contrast tokens.</p>
              </Glass>
            </div>
          </Container>
        </Section>

        {/* 5. ICONS */}
        <Section id="kit-icons" theme={selectedTheme} labelledBy="icon-title">
          <Container>
            <h2 id="icon-title" className="display-3">Icons (24px grid, stroke 1.5)</h2>
            <p className="lead">Crisp vector iconography rendered at 24px and 16px.</p>

            <div className="icon-grid">
              {ALL_ICONS.map((name) => (
                <div key={name} className="icon-sample">
                  <Icon name={name} size={24} />
                  <span className="label">{name}</span>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* 6. SCENE IMAGE (Atmosphere Plate test with missing key) */}
        <Section id="kit-scene" theme={selectedTheme} labelledBy="scene-title">
          <Container>
            <h2 id="scene-title" className="display-3">SceneImage (Atmosphere Plate)</h2>
            <p className="lead">Intentional rendering when no photo is uploaded (zero empty boxes).</p>

            <div className="kit-scene-wrapper">
              <SceneImage assetKey="missingPlateTestKey" />
            </div>
          </Container>
        </Section>

        {/* 7. DEVICE FRAME */}
        <Section id="kit-device" theme={selectedTheme} labelledBy="device-title">
          <Container>
            <h2 id="device-title" className="display-3">DeviceFrame</h2>
            <p className="lead">CSS-only responsive frame with island pill and inner scrolling.</p>

            <DeviceFrame label="Inhabitant Terminal" maxHeight="380px">
              <div className="device-demo-content">
                <span className="label">Arkvoid World Client</span>
                <h3 className="display-3">Elder Pavilion</h3>
                <p className="body">
                  Master Chen observes seasonal wind patterns from the summit shrine.
                </p>
                <Button variant="primary">Record Encounter</Button>
                <div style={{ height: '200px', marginTop: 'var(--space-24)' }}>
                  <p className="body">
                    Deep log entries continue below to demonstrate clean contained scrolling.
                  </p>
                </div>
              </div>
            </DeviceFrame>
          </Container>
        </Section>

        {/* 8. GHOST TEXT */}
        <Section id="kit-ghost" theme={selectedTheme} labelledBy="ghost-title">
          <Container style={{ position: 'relative', overflow: 'clip', minHeight: '260px' }}>
            <GhostText text="Arkvoid" style={{ top: '20px', left: '-20px' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 id="ghost-title" className="display-3">GhostText</h2>
              <p className="lead">Oversized architectural display numeral or wordmark.</p>
            </div>
          </Container>
        </Section>

        {/* 9. DIALOG */}
        <Section id="kit-dialog" theme={selectedTheme} labelledBy="dialog-sec-title">
          <Container>
            <h2 id="dialog-sec-title" className="display-3">Dialog (showModal)</h2>
            <p className="lead">Native modal with focus trap, backdrop close, and scroll lock.</p>

            <Button
              ref={dialogTriggerRef}
              variant="secondary"
              onClick={() => setDialogOpen(true)}
            >
              Open World Covenant Modal
            </Button>

            <Dialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              titleId="covenant-dialog-title"
              title="Valley Covenant #01"
              triggerRef={dialogTriggerRef}
            >
              <p className="body">
                Every inhabitant action must be verified by the rule engine before becoming history.
                Memories are derived from recorded events, never hallucinated state.
              </p>
              <div style={{ marginTop: 'var(--space-24)', display: 'flex', gap: 'var(--space-12)' }}>
                <Button variant="primary" onClick={() => setDialogOpen(false)}>
                  Inscribe Covenant
                </Button>
                <Button variant="quiet" onClick={() => setDialogOpen(false)}>
                  Dismiss
                </Button>
              </div>
            </Dialog>
          </Container>
        </Section>

        {/* 10. MOTION PRESETS */}
        <Section id="kit-motion" theme={selectedTheme} labelledBy="motion-title">
          <Container>
            <ScrollProgress />
            <Heading
              level={2}
              text="Motion Engine Presets"
              italic="Presets"
              ember={true}
              className="display-3"
            />
            <p className="lead">
              Every reveal preset demonstrated with shared IntersectionObserver registry.
            </p>

            <div className="kit-grid-3" style={{ marginTop: 'var(--space-32)' }}>
              <Reveal reveal="up" delay={1}>
                <Glass tone="dark" radius="md" padded>
                  <span className="label">Preset: [data-reveal="up"] (Delay 1)</span>
                  <p className="body">Slides upward from var(--t-m) with opacity fade.</p>
                </Glass>
              </Reveal>

              <Reveal reveal="fade" delay={2}>
                <Glass tone="dark" radius="md" padded>
                  <span className="label">Preset: [data-reveal="fade"] (Delay 2)</span>
                  <p className="body">Pure opacity crossfade without transform displacement.</p>
                </Glass>
              </Reveal>

              <Reveal reveal="rise-s" delay={3}>
                <Glass tone="dark" radius="md" padded>
                  <span className="label">Preset: [data-reveal="rise-s"] (Delay 3)</span>
                  <p className="body">Subtle upward rise from var(--t-s) with soft landing.</p>
                </Glass>
              </Reveal>
            </div>

            <div style={{ marginTop: 'var(--space-24)' }}>
              <span className="label">Preset: [data-reveal="line"]</span>
              <Reveal reveal="line" style={{ height: '2px', backgroundColor: 'var(--accent)', marginTop: 'var(--space-8)' }}>
                <div style={{ height: '100%' }} />
              </Reveal>
            </div>

            <div style={{ marginTop: 'var(--space-32)' }}>
              <span className="label">SplitWords Typography Component:</span>
              <div style={{ marginTop: 'var(--space-8)' }}>
                <SplitWords
                  text="A world that remembers you"
                  as="h3"
                  className="display-3"
                />
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-32)' }}>
              <span className="label">Long Heading (&gt; 60 chars automatically uses rise-s):</span>
              <div style={{ marginTop: 'var(--space-8)' }}>
                <Heading
                  level={3}
                  text="Arkvoid puts a rule-keeping engine between what a character wants to do and what actually happens"
                  ember={true}
                  className="display-3"
                />
              </div>
            </div>
          </Container>
        </Section>
      </main>
    </div>
  );
}
