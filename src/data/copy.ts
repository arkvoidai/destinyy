/**
 * Arkvoid Content System & Master Copy
 * Typed `as const`, VERBATIM from specification.
 * Every visible string on the site comes from here.
 * Headline strings that end in the Ember omit the final period on purpose.
 */

export const copy = {
  nav: {
    links: [
      { label: 'The World', href: '#world' },
      { label: 'The People', href: '#people' },
      { label: 'The Demo', href: '#prototype' },
      { label: 'The Engine', href: '#engine' },
      { label: 'The Device', href: '#device' },
      { label: 'The Plan', href: '#plan' },
    ],
    cta: {
      label: 'Enter the demo',
      href: '#prototype',
    },
    brief: 'Read the 60-second brief',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    skip: 'Skip to content',
  },

  hero: {
    eyebrow: 'Arkvoid Inc.',
    h1: 'A world that knows you were here',
    italic: 'knows you were here',
    sub: 'Arkvoid is building a living world you can step into, and the device to enter it. The people there have names, histories and memories. What you do stays done.',
    primary: {
      label: 'Enter the demo',
      href: '#prototype',
    },
    secondary: {
      label: 'See how it works',
      href: '#engine',
    },
    status: 'In development. Demo below.',
    glance: [
      { k: 'Building', v: 'A living cultivation world' },
      { k: 'Behind it', v: 'An engine that keeps it true' },
      { k: 'Next', v: 'Phones, headsets and our own eyewear' },
      { k: 'Founder', v: 'Manish Talukdar' },
    ],
  },

  welcome: {
    title: 'Welcome back.',
    since: 'You were last here',
    resume: 'Pick up where you left off',
    entries: 'entries are waiting in the courtyard',
  },

  manifesto: {
    lines: [
      'Pages taught us to read.',
      'Apps taught us to do.',
      'Chats taught us to ask.',
      'Worlds will teach us to belong',
    ],
    rail: ['Pages', 'Apps', 'Chats', 'Worlds'],
    sub: 'Every era made computers feel more alive. Arkvoid builds the next one: a place that remembers you.',
  },

  ache: {
    label: 'The missing piece',
    beats: [
      'You saved the village.',
      'You made a friend.',
      'You closed the app. No one there ever knew.',
    ],
    closing: 'We are building a place that does',
  },

  world: {
    label: 'The first world',
    h2: 'Five moments. One life',
    chapters: [
      {
        n: '01',
        t: 'Arrive',
        d: 'Step into a mountain sect at first light. Mist on the stones, smoke from a kitchen, a world already in motion with no script waiting for you.',
      },
      {
        n: '02',
        t: 'Meet',
        d: 'Five to ten people live here. Each has a name, a temper, a past and something they want. They speak to you because they choose to.',
      },
      {
        n: '03',
        t: 'Change',
        d: 'Share what you have. Keep a promise. Move a stone. The world writes it down, and it becomes part of the place.',
      },
      {
        n: '04',
        t: 'Leave',
        d: 'Close the world. Their lives go on: training, travelling, waiting, letting go of what does not matter.',
      },
      {
        n: '05',
        t: 'Return',
        d: 'Come back and someone asks about the road you took. They remember. That moment is the whole product.',
      },
    ],
  },

  people: {
    label: 'The people',
    h2: 'Meet people, not characters',
    sub: 'Every inhabitant is built from a name, a past, a want and a memory that points to something that really happened.',
    memoryLabel: 'How a memory forms',
    memory: [
      {
        day: 'Day 1',
        line: 'You give the old scholar half your food on the bridge.',
      },
      {
        day: 'Day 3',
        line: 'He tells a young disciple about the stranger who stopped.',
      },
      {
        day: 'Day 7',
        line: 'You return. He asks if the mountain road was kind to you.',
      },
    ],
    cast: [
      {
        t: 'The scholars',
        d: 'They keep centuries of memory by hand.',
      },
      {
        t: 'The disciples',
        d: 'They train at dawn and argue at dusk.',
      },
      {
        t: 'The ancient beasts',
        d: 'They keep to the high forests and watch.',
      },
      {
        t: 'The immortals',
        d: 'Rarely seen. Never forgotten.',
      },
    ],
  },

  prototype: {
    label: 'The demo',
    h2: 'Take a step. Watch the world write it down',
    body: 'Choose an action in the courtyard. The rules check it, the world records it, and the people there remember. Leave for a day and come back.',
    note: 'Saved on this device.',
    sanctuaryCaption: 'Valley Sanctuary · Inhabitants Active',
    verificationPipeline: 'Verification Pipeline',
  },

  engine: {
    label: 'The engine',
    h2: 'The AI suggests. The world decides',
    body: 'Language models are brilliant at sounding right. They are not built to stay right. Arkvoid puts a rule-keeping engine between what a character wants to do and what actually happens, so a world can run for years without contradicting itself.',
    diagram: {
      suggest: 'Suggest',
      check: 'Check',
      record: 'Record',
    },
    steps: [
      {
        n: '01',
        t: 'Notice',
        d: 'A player or a character acts. The engine reads the world as it is right now.',
      },
      {
        n: '02',
        t: 'Remember',
        d: 'It pulls the memories that matter, each tied to a real event.',
      },
      {
        n: '03',
        t: 'Suggest',
        d: 'A model proposes what should happen, in a form the engine can check.',
      },
      {
        n: '04',
        t: 'Check',
        d: 'Rules test it. Is it possible, allowed, safe and consistent?',
      },
      {
        n: '05',
        t: 'Record',
        d: 'If it passes, it is written to the permanent record. If it fails, nothing changes.',
      },
      {
        n: '06',
        t: 'Resume',
        d: 'Memories grow from the record. Next time you arrive, the world picks up exactly there.',
      },
    ],
    pillars: [
      {
        t: 'Memory with sources',
        d: 'Every memory points to the event that created it. When a character is unsure, it says so.',
      },
      {
        t: 'Rules before results',
        d: 'A model can suggest anything. Only valid actions become real.',
      },
      {
        t: 'Life that costs little to keep',
        d: 'People nobody is watching run on light routines. Heavy thinking is saved for moments that matter.',
      },
    ],
    targetsLabel: 'What we are engineering for',
    targets: [
      {
        v: '95%',
        d: 'of remembered facts correct, each one traceable to an event.',
      },
      {
        v: '70%',
        d: 'less compute to keep background characters alive.',
      },
      {
        v: '40%',
        d: 'faster when a character repeats a routine.',
      },
      {
        v: '7 days',
        d: 'for players to come back on their own.',
      },
    ],
    targetsNote: 'Engineering targets, measured on a fixed test we will publish.',
  },

  research: {
    label: 'Where we are digging',
    h2: 'Four questions we are working to answer',
    chip: 'Investigating',
    items: [
      {
        t: 'Can a character remember like a person?',
        k: 'Persistent agent runtime',
        d: 'Characters that keep goals, routines and sourced memories across days, restarts and model changes.',
      },
      {
        t: 'Can repetition become cheap?',
        k: 'Crystallizing execution',
        d: 'When a character repeats a routine, we turn the thinking into a checked, reusable routine, and fall back to the model when something new happens.',
      },
      {
        t: 'Can a whole world run on a small budget?',
        k: 'Sparse simulation',
        d: 'The closer you are to something, the more detail it gets. Everything else runs lightly and catches up when you arrive.',
      },
      {
        t: 'Can one world fit every window?',
        k: 'Device-independent runtime',
        d: 'The same world and the same actions on a browser, a phone, a headset and our own eyewear.',
      },
    ],
  },

  device: {
    label: 'The way in',
    h2: 'Then we take away the screen',
    body: 'A world this alive should not live behind glass. Arkvoid is building the world and the device to enter it together, so the place and the window are made for each other.',
    lensIdle: 'Put them on',
    lensActive: 'Take them off',
    lensA: 'Without Arkvoid',
    lensB: 'With Arkvoid',
    ladder: [
      {
        t: 'Browser',
        d: 'The world opens here first.',
        s: 'Now',
      },
      {
        t: 'Phone',
        d: 'Carry it with you.',
        s: 'Next',
      },
      {
        t: 'Headsets',
        d: 'Learn what presence demands.',
        s: 'Next',
      },
      {
        t: 'Arkvoid eyewear',
        d: 'Light enough to wear all day, designed around the world.',
        s: 'Ahead',
      },
    ],
    tag: 'Concept. Illustrative.',
  },

  realms: {
    label: 'The cultivation realms',
    h2: 'Nine realms of power',
    sub: 'Six are known. Three are still unknown.',
    items: [
      { n: '01', t: 'Origin Veil' },
      { n: '02', t: 'Spirit Abyss' },
      { n: '03', t: 'Astral Crucible' },
      { n: '04', t: 'Eternal Soul' },
      { n: '05', t: 'Law Dominion' },
      { n: '06', t: 'Void Sovereignty' },
    ],
    unknown: ['07', '08', '09'],
    unknownLabel: 'Unknown',
  },

  plan: {
    label: 'The plan',
    h2: 'Six steps. One direction',
    steps: [
      {
        n: '01',
        t: 'Specify',
        d: 'Lock the world, its people and its rules.',
        s: 'Now',
      },
      {
        n: '02',
        t: 'Persist',
        d: 'A world that survives restarts and remembers across days.',
        s: 'Next',
      },
      {
        n: '03',
        t: 'Measure',
        d: 'Prove memory, speed and cost against honest baselines.',
        s: 'Next',
      },
      {
        n: '04',
        t: 'Embody',
        d: 'Walk the world on headsets that already exist.',
        s: 'Then',
      },
      {
        n: '05',
        t: 'Open the engine',
        d: 'Give other builders the tools to make worlds that remember.',
        s: 'Then',
      },
      {
        n: '06',
        t: 'Eyewear',
        d: 'Design our own way in.',
        s: 'Then',
      },
    ],
  },

  bet: {
    label: 'The bet',
    h2: 'Start with a world. Prove the engine. Earn the platform',
    category: 'Persistent embodied world computing',
    layers: [
      {
        n: '01',
        t: 'The World',
        s: 'Now',
        d: 'People come for the story and stay for the people. This is the product and the proving ground.',
      },
      {
        n: '02',
        t: 'The Engine',
        s: 'Next',
        d: 'Memory, rules and cheap simulation, packaged so any builder can make a world that remembers.',
      },
      {
        n: '03',
        t: 'The Platform',
        s: 'Then',
        d: 'One runtime across browser, phone, headset and our own eyewear. The place other worlds are built.',
      },
    ],
    line: 'Every era of computing has a layer underneath that quietly decides who gets to build. Arkvoid is aiming to be that layer for persistent worlds.',
  },

  founder: {
    label: 'Founder',
    quote:
      'I wanted to live in a cultivation world, not just read about one. So I am building it, and everything it needs to be real.',
    name: 'Manish Talukdar',
    role: 'Founder, Arkvoid Inc.',
  },

  faq: {
    label: 'Questions',
    h2: 'Straight answers',
    items: [
      {
        q: 'What is Arkvoid?',
        a: 'A company building a living cultivation world you can enter, the engine that keeps such worlds true, and in time the eyewear to step inside them.',
      },
      {
        q: 'Is it a game?',
        a: 'It begins as a world you live in rather than a level you finish. Underneath it is an engine other builders will use.',
      },
      {
        q: 'Is it a social network?',
        a: 'No. There are no feeds, likes or followers. You meet a place and the people who live in it.',
      },
      {
        q: 'Do the characters really remember?',
        a: 'Yes. Every memory is tied to a recorded event, so they recall what happened, and say so when they are unsure.',
      },
      {
        q: 'Are the characters alive?',
        a: 'No. They are AI-driven inhabitants with memory, goals and routines, designed to feel present without pretending to be conscious.',
      },
      {
        q: 'When can I enter?',
        a: 'The browser demo is open now. The first full world is in development. Follow @ArkvoidAI for updates.',
      },
      {
        q: 'Will Arkvoid build hardware?',
        a: 'Yes, in time. Browser first, then phones and existing headsets, then eyewear designed around the world.',
      },
    ],
  },

  brief: {
    title: 'The 60-second brief',
    blocks: [
      {
        t: 'What we are building',
        d: 'A living cultivation world, the engine that keeps worlds true, and eyewear to step inside them.',
      },
      {
        t: 'Why it matters',
        d: 'Computers moved from pages to apps to chats. The next step is places that persist and remember. The missing piece is not graphics. It is a world that stays true.',
      },
      {
        t: 'Why it is hard',
        d: 'A model can sound right. A world has to be right, for months, for many people, at a cost that works.',
      },
      {
        t: 'How we start',
        d: 'One small world, built to be proven. Then the engine behind it. Then the platform.',
      },
      {
        t: 'What we measure',
        d: 'Memory correctness, the cost of keeping a world alive, speed on repeated routines, and whether players come back on their own.',
      },
      {
        t: 'Talk to us',
        d: 'Investors, researchers and builders: write to heyarkvoid@gmail.com or find us at @ArkvoidAI.',
      },
    ],
    close: 'Close',
  },

  finale: {
    h2: 'Step into a world that remembers',
    body: 'Try the demo today. Follow the build as it grows.',
    primary: {
      label: 'Enter the demo',
      href: '#prototype',
    },
    secondary: {
      label: 'Follow @ArkvoidAI',
      href: 'https://x.com/ArkvoidAI',
    },
    email: 'heyarkvoid@gmail.com',
    copy: 'Copy email',
    copied: 'Email copied',
  },

  footer: {
    tagline: 'Living worlds, and the way in.',
    legal: '© 2026 Arkvoid Inc.',
    note: 'Images are concept art.',
    memoryNote: 'Arkvoid remembers you on this device, and nowhere else.',
  },

  ui: {
    skipToContent: 'Skip to content',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    menuTitle: 'Menu',
    loading: 'Loading...',
    retry: 'Retry',
    conceptArtCaption: 'Concept art.',
    todayCaption: 'Today.',
    closeDialog: 'Close dialog',
    deviceDisplayArea: 'display area',
    emailCopied: 'Email copied to clipboard',
    copyEmail: 'Copy email address',
    externalLink: 'Opens in a new tab',
    sectionNavigation: 'Section navigation',
  },
} as const;

export type Copy = typeof copy;
