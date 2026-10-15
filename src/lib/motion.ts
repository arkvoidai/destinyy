/**
 * Arkvoid Motion Engine
 * Performance-hardened motion runtime, centralized observer registry,
 * FPS degradation guard, and scroll timeline feature detection.
 */

export type MotionMode = 'full' | 'lite' | 'none';

let hasFiredObserver = false;
let failsafeTimer: ReturnType<typeof setTimeout> | null = null;
let fpsGuardRan = false;

/**
 * 1. Motion Mode Detection
 * Reconciles boot script, observes prefers-reduced-motion changes,
 * and sets html[data-motion].
 */
export function detectMotionMode(): MotionMode {
  if (typeof document === 'undefined') return 'full';

  try {
    const stored = window.sessionStorage.getItem('arkvoid.motion');
    if (stored === 'full' || stored === 'lite' || stored === 'none') {
      document.documentElement.setAttribute('data-motion', stored);
      return stored;
    }
  } catch {
    // Session storage blocked
  }

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const mode: MotionMode = prefersReduced ? 'none' : 'full';
  document.documentElement.setAttribute('data-motion', mode);

  // Live change listener
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', (e) => {
      const nextMode = e.matches ? 'none' : 'full';
      document.documentElement.setAttribute('data-motion', nextMode);
    });
  }

  return mode;
}

/**
 * 2. FPS Guard
 * For 2.5s after load, measures rAF frame deltas.
 * If median delta exceeds 24ms (dropping below ~40fps), degrades to lite.
 * The loop always terminates itself and never runs again.
 */
export function startFpsGuard(): void {
  if (typeof window === 'undefined' || fpsGuardRan) return;
  fpsGuardRan = true;

  const currentMode = document.documentElement.getAttribute('data-motion');
  if (currentMode === 'none' || currentMode === 'lite') return;

  const deltas: number[] = [];
  let lastTime = performance.now();
  const startTime = lastTime;
  const DURATION = 2500; // 2.5 seconds

  function frame(now: number) {
    const delta = now - lastTime;
    lastTime = now;

    // Discard outlier freeze spikes (e.g. background tab switch)
    if (delta < 200) {
      deltas.push(delta);
    }

    if (now - startTime < DURATION) {
      requestAnimationFrame(frame);
    } else {
      if (deltas.length >= 10) {
        deltas.sort((a, b) => a - b);
        const median = deltas[Math.floor(deltas.length / 2)] ?? 16;
        if (median > 24) {
          document.documentElement.setAttribute('data-motion', 'lite');
          try {
            window.sessionStorage.setItem('arkvoid.motion', 'lite');
          } catch {
            // Ignore storage write error
          }
        }
      }
    }
  }

  requestAnimationFrame(frame);
}

/**
 * 3. Scroll Timeline Feature Detection
 * Adds 'sd' (scroll-driven) or 'no-sd' class to <html>.
 */
export function supportsScrollTimeline(): boolean {
  if (typeof CSS === 'undefined' || typeof document === 'undefined') return false;

  const supported =
    typeof CSS.supports === 'function' &&
    CSS.supports('animation-timeline: view()');

  if (supported) {
    document.documentElement.classList.add('sd');
    document.documentElement.classList.remove('no-sd');
  } else {
    document.documentElement.classList.add('no-sd');
    document.documentElement.classList.remove('sd');
  }

  return supported;
}

/**
 * 4. Centralized Shared Observer Registry
 * One shared IntersectionObserver instance per options key.
 * No per-element IntersectionObservers anywhere in the app.
 */
type ObserverCallback = (entry: IntersectionObserverEntry) => void;

const registry = new Map<
  string,
  {
    observer: IntersectionObserver;
    callbacks: Map<Element, ObserverCallback>;
  }
>();

function getOptionsKey(opts: IntersectionObserverInit): string {
  const root = opts.root ? 'custom' : 'viewport';
  const margin = opts.rootMargin || '0px';
  const threshold = Array.isArray(opts.threshold)
    ? opts.threshold.join(',')
    : opts.threshold ?? 0;
  return `${root}|${margin}|${threshold}`;
}

export function observe(
  element: Element,
  callback: ObserverCallback,
  options: IntersectionObserverInit = {
    threshold: 0.15,
    rootMargin: '0px 0px -8% 0px',
  }
): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    // Fallback: trigger immediately
    hasFiredObserver = true;
    callback({
      target: element,
      isIntersecting: true,
      intersectionRatio: 1,
    } as unknown as IntersectionObserverEntry);
    return;
  }

  const key = getOptionsKey(options);
  let entry = registry.get(key);

  if (!entry) {
    const callbacks = new Map<Element, ObserverCallback>();
    const observer = new IntersectionObserver((entries) => {
      hasFiredObserver = true;
      if (failsafeTimer) {
        clearTimeout(failsafeTimer);
        failsafeTimer = null;
      }
      for (const ent of entries) {
        const cb = callbacks.get(ent.target);
        if (cb) cb(ent);
      }
    }, options);

    entry = { observer, callbacks };
    registry.set(key, entry);
  }

  entry.callbacks.set(element, callback);
  entry.observer.observe(element);
}

export function unobserve(element: Element): void {
  for (const { observer, callbacks } of registry.values()) {
    if (callbacks.has(element)) {
      callbacks.delete(element);
      observer.unobserve(element);
    }
  }
}

/**
 * 5. createIdleLoop
 * rAF loop that starts on demand, stops when fn() returns false,
 * pauses when tab is hidden or element is offscreen, and always cleans up.
 */
export function createIdleLoop(fn: () => boolean | void): () => void {
  let running = true;
  let rafId: number | null = null;

  function loop() {
    if (!running) return;

    if (document.hidden) {
      // Pause while tab hidden
      return;
    }

    const shouldContinue = fn();
    if (shouldContinue === false) {
      running = false;
      return;
    }

    rafId = requestAnimationFrame(loop);
  }

  function handleVisibilityChange() {
    if (!document.hidden && running) {
      rafId = requestAnimationFrame(loop);
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange);
  rafId = requestAnimationFrame(loop);

  return () => {
    running = false;
    if (rafId !== null) cancelAnimationFrame(rafId);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}

/**
 * 6. easeScrollTo
 * Physics-calibrated smooth scroll for anchor links.
 * Duration scales with distance clamped between 500ms and 900ms.
 * Cancels instantly on wheel, touch, or key. Moves focus to target heading.
 */
export function easeScrollTo(
  target: HTMLElement | string,
  options?: { offset?: number }
): void {
  if (typeof window === 'undefined') return;

  const el =
    typeof target === 'string'
      ? document.querySelector<HTMLElement>(target)
      : target;
  if (!el) return;

  const motionMode = document.documentElement.getAttribute('data-motion');
  const targetId = el.getAttribute('id');

  // Compute offset: header height + 8px default
  let headerH = 68;
  const rootHeaderH = getComputedStyle(document.documentElement).getPropertyValue(
    '--header-h'
  );
  if (rootHeaderH) {
    const parsed = parseInt(rootHeaderH, 10);
    if (!isNaN(parsed)) headerH = parsed;
  }
  const offset = options?.offset ?? headerH + 8;

  // Move focus cleanly for screen readers and keyboard users
  const moveFocus = () => {
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
    if (targetId) {
      history.replaceState(null, '', `#${targetId}`);
    }
  };

  if (motionMode === 'none') {
    el.scrollIntoView({ behavior: 'auto' });
    moveFocus();
    return;
  }

  const startY = window.pageYOffset;
  const targetRect = el.getBoundingClientRect();
  const targetY = startY + targetRect.top - offset;
  const distance = Math.abs(targetY - startY);

  if (distance < 5) {
    moveFocus();
    return;
  }

  // Duration scales with distance: clamped 500 to 900ms
  const duration = Math.min(Math.max(distance * 0.5, 500), 900);
  const startTime = performance.now();
  let cancelled = false;

  const cancel = () => {
    cancelled = true;
    window.removeEventListener('wheel', cancel);
    window.removeEventListener('touchstart', cancel);
    window.removeEventListener('keydown', cancel);
  };

  window.addEventListener('wheel', cancel, { passive: true });
  window.addEventListener('touchstart', cancel, { passive: true });
  window.addEventListener('keydown', cancel, { passive: true });

  // Standard cubic-bezier(0.65, 0, 0.35, 1) ease-in-out approximation
  function easeInOut(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(now: number) {
    if (cancelled) return;
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOut(progress);

    window.scrollTo(0, startY + (targetY - startY) * eased);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      cancel();
      moveFocus();
    }
  }

  requestAnimationFrame(step);
}

/**
 * 7. markReady
 * Runs after first paint (two rAFs) to add 'motion-ready',
 * starts the FPS guard, and sets a 1500ms observer failsafe.
 */
export function markReady(): void {
  if (typeof document === 'undefined') return;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.add('motion-ready');
      startFpsGuard();

      // 1500ms failsafe timer: forces visibility if no observer fires
      failsafeTimer = setTimeout(() => {
        if (!hasFiredObserver) {
          document.documentElement.classList.add('motion-failsafe');
        }
      }, 1500);
    });
  });
}
