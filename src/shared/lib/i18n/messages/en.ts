export default {
  terminal: {
    title: 'Spacedev CLI | Terminal Portfolio',
    welcome: 'Access Granted. Terminal initialized. Type "help" to see the list of commands.',
    prompt: "visitor{'@'}spacedev:~$",
    loading: 'Loading',
    syncing: 'SYNCING...',
    cleared: 'Terminal cleared.',
  },
  cmd: {
    help: {
      title: 'AVAILABLE COMMANDS:',
      desc: 'Show available commands'
    },
    clear: {
       desc: 'Clear terminal history'
    },
    project: {
       desc: 'List projects',
       usage: 'Usage: project projects'
    },
    ls: {
       desc: 'List items (e.g., ls projects, ls courses, ls education)',
       usage: 'Available paths: projects, courses, education',
       projects: 'PROJECTS:',
       courses: 'COURSES & CERTIFICATIONS:'
    },
    about: {
       desc: 'About the creator',
       identified: 'IDENTIFIED:',
       role: 'ROLE:',
       bio: 'BIO:',
       skills: 'SKILLS:',
       location: 'LOCATION:',
       status: 'STATUS:'
    },
    teach: {
       desc: 'Teach me something new',
       usage: 'Usage: teach',
       loading: 'Loading knowledge modules...',
       facts: [
         '1. The first programmer in history – Ada Lovelace (1843)\n\nAda Lovelace wrote the first algorithm for Charles Babbage\'s Analytical Engine in 1843.\n\nIt was an algorithm for calculating Bernoulli numbers.\n\nImportant:\nthe machine was never built, but the algorithm existed — that\'s why she is considered the first programmer.',
         '2. The first computer bug was an actual insect (1947)\n\nGrace Hopper and her team found a moth stuck in a relay of the Harvard Mark II computer.\n\nThey taped it into the logbook with the entry:\n\n"First actual case of bug being found"\n\nThis is where the term debugging comes from.',
         '3. The first high-level language — Fortran (1957)\n\nCreated by a team led by John Backus at IBM.\n\nFortran first allowed writing:\n\nDO I = 1, 10\n\ninstead of machine code.\n\nThis accelerated software development tenfold.',
         '4. The C language was created for Unix development (1972)\n\nDennis Ritchie created C at Bell Labs to rewrite Unix.\n\nBefore that, Unix was written in assembly.\n\nC allowed making Unix portable.\n\nToday C is at the core of:\n\nLinux\n\nWindows\n\nmacOS\n\nGit\n\nPython interpreter',
         '5. The first virus appeared in 1971 — Creeper\n\nThe Creeper virus spread over ARPANET and displayed the message:\n\nI\'M THE CREEPER: CATCH ME IF YOU CAN\n\nIt wasn\'t malicious — it was an experiment.',
         '6. The world\'s first website is still online (1991)\n\nCreated by Tim Berners-Lee.\n\nAddress:\n\ninfo.cern.ch\n\nIt described what the World Wide Web was.',
         '7. Microsoft\'s first programmer wrote Altair BASIC in 2 months (1975)\n\nBill Gates and Paul Allen wrote BASIC for the Altair 8800.\n\nInteresting fact:\nthey didn\'t even have the computer itself — they wrote it on a simulator.',
         '8. The term "open source" only appeared in 1998\n\nBefore that, the term used was:\n\nfree software\n\n"Open source" was coined for business to sound less political.',
         '9. The first JavaScript was written in 10 days (1995)\n\nCreated by Brendan Eich.\n\nInitial name:\n\nMocha → LiveScript → JavaScript\n\nIt was created for the Netscape Navigator browser.',
         '10. Git was created in 10 days (2005)\n\nLinus Torvalds wrote the first version of Git in 10 days.\n\nThe reason was a conflict between Linux and the BitKeeper system.\n\nToday Git is used throughout almost the entire industry.'
       ]
    },
    matrix: {
       desc: 'Enter the matrix',
       follow: 'Follow the white rabbit...'
    },
    exit: {
       desc: 'Terminate session',
       terminating: 'Terminating session...',
       goodbye: 'Goodbye, user.'
    },
    senior: {
        desc: 'Unlock maximum experience',
        activated: 'WARNING: Senior levels detected. Diverting power to red sub-systems...',
        overdrive: 'OVERDRIVE ACTIVATED.',
        deactivated: 'Senior mode deactivated. Restoring visual balance...'
    },
    refactor: {
        desc: 'Optimize the codebase',
        scanning: 'Scanning for technical debt...',
        complete: 'Refactoring complete. 0 bugs found (ignored).'
    },
    sudo: {
        desc: 'Execute command as superuser',
        denied: 'visitor is not in the sudoers file. This incident will be reported.'
    },
    echo: {
        desc: 'Print text to terminal'
    },
    doom: {
       desc: 'Run Doom',
       loading: 'LOADING DEMONIC ENTITIES...',
       closed: 'DOOM SESSION TERMINATED. RETURNING TO TERMINAL INTERFACE...',
       fullscreen: 'Fullscreen',
       close: 'Close Game'
    },
    lang: {
        desc: 'Change interface language (ru/en)',
        usage: 'Usage: lang <ru|en>',
        current: 'Current language: {lang}',
        available: 'Available: ru, en',
        changed: 'Language changed to {lang}',
        opening: 'Opening {type} for {slug}...'
    }
  },
  status: {
    time: 'TIME',
    mode: 'MODE',
    lang: 'LANG',
    tip: 'TIP',
    tips: [
      'Type "help" for commands',
      'Try "matrix" for effect',
      'Use "project" to view projects',
      'Tab for autocomplete',
      'Arrow Up for history',
      'Visit "about" to know more',
      'CRT effects are active',
      'Neural link synchronized'
    ]
  },
  errors: {
    unknownCommand: 'Unknown command: {cmd}',
    invalidUsage: 'Invalid usage: {usage}',
    projectNotFound: 'Project not found: {slug}',
    autocompleteMatches: 'Matches: {matches}'
  },
  render: {
    engine: 'Visual Engine v1.0.4',
    processing: 'PROCESSING...',
    stable: 'LINK STABLE',
    lowPerf: 'LOW PERF MODE ACTIVE',
    resolution: 'RES:',
    fps: 'FPS:',
    loading: 'Loading',
    neural: 'Neural interface synchronized with terminal input stream'
  },
  profile: {
    name: 'Stanislav Chumakov (spaceDev)',
    title: 'Senior Frontend Engineer / Frontend Architect',
    bio: `Frontend developer detected. Active since 04.2018.\n            Class: Senior. Previous role: Team Lead (Frontend / Design).\n\n            Specialization:\n            — SPA architecture\n            — building scalable UI systems\n            — data-driven interface development\n            — performance and stability optimization\n\n            Status: production-ready\n            Architectural thinking: confirmed\n            Access level: Senior`,
    location: 'Distributed / Remote-first',
    status: 'Available for deep-space missions',
  },
  projects: {
    datatree: {
      name: 'dataTree',
      summary: 'Professional data visualization and analysis tool',
      description: 'A professional tool for visualizing, analyzing and comparing JSON and XML structures directly in the browser. Focused on performance and developer experience.',
    },
    frontbeancms: {
      name: 'FrontBeanCMS',
      summary: 'High-performance Nuxt 4 frontend (NDA)',
      description: 'Modern high-performance frontend based on Nuxt 4, designed to work as a headless CMS for Django-based web projects. Features: SSR, OpenAPI type generation, dynamic Sitemaps, and PWA.',
    },
    acena: {
      name: 'Aceña',
      summary: 'Modern educational platform (LMS)',
      description: 'Aceña is a modern LMS for foreign language teachers. Built with Vue.js and Capacitor for cross-platform support. Features AI-powered lesson creation and interactive assignments.',
    },
  },
  notFound: {
    navigating: '> navigating to {path}',
    resolving: '> resolving route...',
    syncing: '> syncing timelines [past|future]...',
    scanning: '> scanning sectors...',
    seekingSector: 'seeking sector: /routes/…',
    checksumMismatch: 'checksum mismatch',
    temporalDesync: '> TEMPORAL DESYNC DETECTED',
    routeNotFound: '> ROUTE_NOT_FOUND',
    outsideMap: '> you are outside the map',
    typeHome: "> Type 'home' to return",
    returning: '> Returning to known timeline...',
    homeDesc: 'Return to the main page',
    sceneSubText: 'ROUTE_NOT_FOUND',
  },
  courses: {
    'advanced-webgl': {
      title: 'Advanced WebGL & Shaders',
      provider: 'Bruno Simon / Three.js Journey',
    },
    'design-systems': {
      title: 'Enterprise Design Systems with Figma',
      provider: 'Interaction Design Foundation',
    },
    'rust-systems-prog': {
      title: 'Rust for Systems Programming',
      provider: 'Pluralsight',
    },
  }
}
