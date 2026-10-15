import React, { useState, useRef, useTransition, useContext } from 'react';
import { Container } from '../components/Container';
import { Chip } from '../components/Chip';
import { Heading } from '../components/Heading';
import { Glass } from '../components/Glass';
import { SceneImage } from '../components/SceneImage';
import { Icon } from '../components/Icon';
import { DeviceFrame } from '../components/DeviceFrame';
import { Reveal } from '../components/Reveal';
import { RevealGroup } from '../components/RevealGroup';
import { copy } from '../data/copy';
import { usePrototype } from '../world/usePrototype';
import { WorldContext, WorldProvider } from '../world/provider';
import { useFlip } from '../hooks/useFlip';
import { saveWorldState } from '../world/storage';
import { initialWorldState } from '../world/state';
import type { ActionProposal } from '../world/types';
import './Demo.css';

interface ActionItem {
  id: string;
  actorId: string;
  label: string;
  meaning: string;
  icon: 'door' | 'scroll' | 'spark' | 'shield' | 'clock';
  proposal: ActionProposal;
  isLeave?: boolean;
}

const DEMO_ACTIONS: ActionItem[] = [
  {
    id: 'act-pass',
    actorId: 'chen',
    label: 'Ask about the pass',
    meaning: 'Inquire about mountain road conditions and travellers',
    icon: 'door',
    proposal: {
      actorId: 'chen',
      action: 'Ask about the pass',
      intent: 'Inquire about mountain pass conditions',
    },
  },
  {
    id: 'act-guidance',
    actorId: 'chen',
    label: 'Request guidance',
    meaning: 'Seek Master Chen’s counsel on valley breath meridians',
    icon: 'spark',
    proposal: {
      actorId: 'chen',
      action: 'Request guidance',
      intent: 'Seek elder counsel on cultivation',
    },
  },
  {
    id: 'act-training',
    actorId: 'lin',
    label: 'Begin training',
    meaning: 'Apprentice Lin tends medicinal herbs and begins morning forms',
    icon: 'scroll',
    proposal: {
      actorId: 'lin',
      action: 'Begin training',
      intent: 'Practice breath forms in the orchid pavilion',
    },
  },
  {
    id: 'act-marker',
    actorId: 'wu',
    label: 'Inspect the marker',
    meaning: 'Elder Wu examines inscribed boundary stone glyphs',
    icon: 'shield',
    proposal: {
      actorId: 'wu',
      action: 'Inspect the marker',
      intent: 'Verify covenant inscriptions on the stone',
    },
  },
  {
    id: 'act-clue',
    actorId: 'lin',
    label: 'Investigate the clue',
    meaning: 'Attempt to search forbidden ridge without lantern fuel',
    icon: 'spark',
    proposal: {
      actorId: 'lin',
      action: 'Investigate the clue without fuel',
      intent: 'Search forbidden ridge without fuel',
    },
  },
  {
    id: 'act-leave',
    actorId: 'chen',
    label: 'Leave and return the next day',
    meaning: 'The sun sets and rises. The world records the passage of a full cycle.',
    icon: 'clock',
    isLeave: true,
    proposal: {
      actorId: 'chen',
      action: 'Advance solar cycle to next day',
      intent: 'Rest overnight and return at dawn',
    },
  },
];

const PIPELINE_STEPS = [
  { n: '01', title: 'Notice', desc: 'The engine reads current state' },
  { n: '02', title: 'Remember', desc: 'Pulls verified memories' },
  { n: '03', title: 'Suggest', desc: 'Model proposes action' },
  { n: '04', title: 'Check', desc: 'Rules test consistency' },
  { n: '05', title: 'Record', desc: 'Inscribes permanent event' },
  { n: '06', title: 'Resume', desc: 'World state updates' },
];

const DemoContent: React.FC = () => {
  const { inhabitants, events, clock, dispatchProposal, tick, getInhabitantMemories } =
    usePrototype();

  const [, startTransition] = useTransition();

  // Local state for actions, rejected state, and pipeline cascade
  const [isWorking, setIsWorking] = useState(false);
  const [rejectedActionId, setRejectedActionId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [pipelineState, setPipelineState] = useState<{
    key: number;
    stepIndex: number;
    rejected: boolean;
  }>({ key: 0, stepIndex: -1, rejected: false });

  const [lastResponse, setLastResponse] = useState<{
    speaker: string;
    text: string;
    eventId: string;
    day: number;
  } | null>(null);

  const [committedEventId, setCommittedEventId] = useState<string | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);

  // Focus return ref
  const firstActionRef = useRef<HTMLButtonElement>(null);
  const ledgerRef = useRef<HTMLDivElement>(null);

  // FLIP animation for ledger rows
  useFlip(ledgerRef, events.length);

  // Calculate day and time of day based on clock
  const dayNumber = Math.max(1, Math.floor((clock - 1) / 3) + 1);
  const timePhases = ['Dawn', 'Midday', 'Dusk'];
  const timePhase = timePhases[(clock - 1) % 3] || 'Dawn';

  // Handle Action Execution
  const handleAction = (item: ActionItem) => {
    if (isWorking) return; // Prevent double-triggering

    setIsWorking(true);
    setRejectedActionId(null);
    setRejectionReason(null);

    // If "leave", tick clock first
    if (item.isLeave) {
      tick();
    }

    const result = dispatchProposal(item.proposal);

    startTransition(() => {
      const nextKey = Date.now();

      if (!result.valid) {
        // Rejected by rule engine
        setRejectedActionId(item.id);
        setRejectionReason(result.reason);
        setPipelineState({ key: nextKey, stepIndex: 3, rejected: true });
        setLastResponse({
          speaker: 'Rule Engine',
          text: result.reason,
          eventId: 'rejected',
          day: dayNumber,
        });
        setIsWorking(false);
      } else {
        // Valid action committed
        const committed = result.event;
        if (committed) {
          setCommittedEventId(committed.id);
          const actor = inhabitants.find((inh) => inh.id === committed.actorId);
          setLastResponse({
            speaker: actor ? actor.name : 'Courtyard Inhabitant',
            text: committed.detail,
            eventId: committed.id,
            day: dayNumber,
          });
        }
        setPipelineState({ key: nextKey, stepIndex: 5, rejected: false });
        setIsWorking(false);
      }
    });
  };

  // Clear Record (Two-Step Inline Confirm)
  const handleClearRecord = () => {
    if (!clearConfirm) {
      setClearConfirm(true);
      return;
    }

    // Reset stored state to initial genesis
    saveWorldState(initialWorldState);
    setClearConfirm(false);

    // Return focus to first action
    firstActionRef.current?.focus();
    window.location.reload();
  };

  // Inhabitants display with typographic monogram
  const inhabitantsList = [
    {
      inhabitant: inhabitants[0] || initialWorldState.inhabitants[0],
      present: true,
      presenceText: 'In the courtyard',
    },
    {
      inhabitant: inhabitants[1] || initialWorldState.inhabitants[1],
      present: clock % 2 !== 0,
      presenceText: clock % 2 !== 0 ? 'In the courtyard' : 'Away at the brook',
    },
    {
      inhabitant: inhabitants[2] || initialWorldState.inhabitants[2],
      present: true,
      presenceText: 'In the courtyard',
    },
  ];

  // Screen content
  const screenContent = (
    <div className="courtyard-screen">
      {/* 1. SceneImage demoCourtyard with Overlays */}
      <div className="courtyard-photo-wrap">
        <SceneImage
          assetKey="demoCourtyard"
          hideLabel={true}
          className="courtyard-photo"
        />

        {/* Top-left: Place name chip */}
        <div className="courtyard-overlay-left">
          <Chip variant="glass" className="courtyard-place-chip">
            Sanctuary Courtyard
          </Chip>
        </div>

        {/* Top-right: Day & Phase chip */}
        <div className="courtyard-overlay-right">
          <Chip variant="glass" className="courtyard-clock-chip">
            <span className="clock-phase-text">
              Day {dayNumber} · {timePhase}
            </span>
          </Chip>
        </div>
      </div>

      {/* Role text below the image, never over it */}
      <div className="courtyard-role-caption">
        <span className="label">{copy.prototype.sanctuaryCaption}</span>
      </div>

      {/* 2. Inhabitants (One Glass with 3 rows) */}
      <Glass tone="light" radius="lg" padded className="inhabitants-panel">
        <div className="inhabitants-list">
          {inhabitantsList.map(({ inhabitant, present, presenceText }) => {
            const monogram = inhabitant.name.charAt(0);
            return (
              <div
                key={inhabitant.id}
                className={`inhabitant-row ${!present ? 'is-absent' : ''}`}
              >
                <div className="inhabitant-badge" aria-hidden="true">
                  <span className="monogram">{monogram}</span>
                </div>
                <div className="inhabitant-info">
                  <div className="inhabitant-title-line">
                    <span className="inhabitant-name">{inhabitant.name}</span>
                    <span className="inhabitant-role">{inhabitant.role}</span>
                  </div>
                  <p className="inhabitant-goal">{inhabitant.goal}</p>
                </div>
                <Chip
                  variant="outline"
                  dot={present ? 'now' : 'then'}
                  className="inhabitant-presence-chip"
                >
                  {presenceText}
                </Chip>
              </div>
            );
          })}
        </div>
      </Glass>

      {/* 3. Actions 2-Column Grid */}
      <div className="actions-grid-wrap">
        <div className="actions-grid">
          {DEMO_ACTIONS.map((item, idx) => {
            const isRejected = rejectedActionId === item.id;
            return (
              <button
                key={item.id}
                ref={idx === 0 ? firstActionRef : undefined}
                type="button"
                disabled={isWorking}
                onClick={() => handleAction(item)}
                className={`action-tile-btn ${item.isLeave ? 'is-leave' : ''} ${
                  isRejected ? 'is-rejected' : ''
                }`}
              >
                <div className="action-btn-icon" aria-hidden="true">
                  <Icon name={item.icon} size={20} />
                </div>
                <div className="action-btn-text">
                  <span className="action-label">{item.label}</span>
                  <span className="action-meaning">{item.meaning}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Rejected Reason Banner if action rejected */}
        {rejectionReason && (
          <div className="action-rejection-banner" role="alert">
            <Icon name="close" size={16} />
            <span>{rejectionReason}</span>
          </div>
        )}
      </div>

      {/* 4. Pipeline Stepper Panel */}
      <Glass tone="dark" radius="lg" padded className="pipeline-panel">
        <span className="label pipeline-title">{copy.prototype.verificationPipeline}</span>
        <div key={pipelineState.key} className="pipeline-stepper">
          {PIPELINE_STEPS.map((st, sIdx) => {
            const isDone = pipelineState.stepIndex >= sIdx && (!pipelineState.rejected || sIdx < 3);
            const isRejectedStep = pipelineState.rejected && sIdx === 3;
            return (
              <div
                key={st.n}
                className={`pipeline-step ${isDone ? 'is-done' : ''} ${
                  isRejectedStep ? 'is-rejected' : ''
                }`}
                style={{
                  transitionDelay: `${sIdx * 55}ms`,
                }}
              >
                <div className="step-node-col">
                  <div className="step-node" aria-hidden="true">
                    {isRejectedStep ? (
                      <Icon name="close" size={10} />
                    ) : isDone ? (
                      <span className="node-dot" />
                    ) : null}
                  </div>
                  {sIdx < 5 && <div className="step-line" />}
                </div>
                <div className="step-info">
                  <span className="step-num-name">
                    {st.n} · {st.title} {isRejectedStep && <strong className="rejected-badge">Rejected</strong>}
                  </span>
                  <span className="step-desc">{st.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Glass>

      {/* 5. Response Box & Aria-Live Region */}
      {lastResponse && (
        <Glass tone="dark" radius="lg" padded className="response-panel">
          <div className="response-header">
            <span className="speaker-name">{lastResponse.speaker}</span>
            <span className="response-origin">
              From {lastResponse.eventId} · Day {lastResponse.day}
            </span>
          </div>
          <p className="response-text body">{lastResponse.text}</p>
        </Glass>
      )}

      {/* Accessible live status for screen readers */}
      <div className="sr-only" aria-live="polite">
        {lastResponse ? `${lastResponse.speaker}: ${lastResponse.text}` : ''}
      </div>
    </div>
  );

  return (
    <section id="prototype" data-theme="deep" className="ark-demo" aria-labelledby="demo-heading">
      <Container className="demo-header-container">
        <RevealGroup className="demo-header-block">
          <Reveal reveal="fade" delay={1}>
            <Chip variant="outline" className="demo-label-chip">
              {copy.prototype.label}
            </Chip>
          </Reveal>
          <Reveal reveal="up" delay={2}>
            <Heading
              level={2}
              id="demo-heading"
              text={copy.prototype.h2}
              ember={true}
              className="display-2 demo-title"
            />
          </Reveal>
          <Reveal reveal="up" delay={3}>
            <p className="lead demo-body">{copy.prototype.body}</p>
          </Reveal>
          <Reveal reveal="fade" delay={4}>
            <div className="demo-saved-row">
              <Chip variant="glass" className="saved-device-chip">
                <Icon name="shield" size={14} />
                <span>{copy.prototype.note}</span>
              </Chip>
            </div>
          </Reveal>
        </RevealGroup>
      </Container>

      <Container className="demo-stage-container">
        {/* Left Column: DeviceFrame on desktop, Flat on mobile */}
        <Reveal reveal="up" delay={1} className="demo-left-column">
          <DeviceFrame label="Courtyard Client" maxHeight="900px">
            {screenContent}
          </DeviceFrame>
        </Reveal>

        {/* Right Column: World Record Panel (Sticky at top 96px on desktop) */}
        <Reveal reveal="up" delay={2} className="demo-right-column">
          <div className="record-sticky-wrapper">
            <Glass tone="dark" radius="xl" padded className="record-panel">
              <div className="record-header">
                <div className="record-title-wrap">
                  <h3 className="display-3 record-title">World record</h3>
                  <Chip variant="glass" className="record-count-pill">
                    {events.length} events
                  </Chip>
                </div>

                <div
                  className={`record-sweep-line ${committedEventId ? 'is-sweeping' : ''}`}
                  aria-hidden="true"
                />
              </div>

              {/* Scrollable Event Rows */}
              <div
                ref={ledgerRef}
                tabIndex={0}
                role="region"
                aria-label="Recorded events ledger"
                className="ledger-scroll-area"
              >
                {events.length === 0 ? (
                  <p className="body muted-text">No events recorded yet.</p>
                ) : (
                  [...events].reverse().map((evt) => {
                    const isNewest = evt.id === committedEventId;
                    return (
                      <div
                        key={evt.id}
                        className={`ledger-row ${isNewest ? 'is-committed' : ''}`}
                      >
                        <div className="ledger-row-top">
                          <span className="ledger-id label">{evt.id}</span>
                          <span className="ledger-day label">Clock #{evt.timestamp}</span>
                        </div>
                        <div className="ledger-action">{evt.action}</div>
                        <div className="ledger-detail muted-text">{evt.detail}</div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* What people remember grouping */}
              <div className="record-memories-section">
                <span className="label memories-header">What people remember</span>
                <div className="inhabitant-memory-tiles">
                  {inhabitants.map((inh) => {
                    const memories = getInhabitantMemories(inh.id);
                    return (
                      <div key={inh.id} className="memory-tile">
                        <div className="memory-tile-header">
                          <span className="memory-inh-name">{inh.name}</span>
                          <Chip
                            variant="outline"
                            className="memory-clarity-chip"
                          >
                            {memories.length > 0 ? 'clear' : 'faint'}
                          </Chip>
                        </div>
                        <p className="memory-inh-text">
                          {memories.length > 0
                            ? memories[memories.length - 1]?.summary
                            : 'Recalls no direct interactions yet.'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Clear the Record Two-Step Control */}
              <div className="record-footer">
                <button
                  type="button"
                  onClick={handleClearRecord}
                  className={`clear-record-btn ${clearConfirm ? 'is-confirming' : ''}`}
                >
                  {clearConfirm
                    ? 'Confirm reset (this will reset the ledger)'
                    : 'Clear the record'}
                </button>
              </div>
            </Glass>
          </div>
        </Reveal>
      </Container>
    </section>
  );
};

export const Demo: React.FC = () => {
  const ctx = useContext(WorldContext);
  if (!ctx) {
    return (
      <WorldProvider>
        <DemoContent />
      </WorldProvider>
    );
  }
  return <DemoContent />;
};

export default Demo;
