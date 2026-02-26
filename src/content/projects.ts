import type { Project } from '@/shared/types/content';

export const projects: Project[] = [
  {
    slug: 'datatree',
    name: 'projects.datatree.name',
    summary: 'projects.datatree.summary',
    description: 'projects.datatree.description',
    techStack: ['Vue.js', 'TypeScript', 'D3.js', 'XML/JSON Parser'],
    role: 'Lead Frontend Developer',
    year: '2025',
    links: {
      demo: 'https://datatree.space-dev.tech',
    },
  },
  {
    slug: 'frontbeancms',
    name: 'projects.frontbeancms.name',
    summary: 'projects.frontbeancms.summary',
    description: 'projects.frontbeancms.description',
    techStack: ['Nuxt 4', 'TypeScript', 'Django API', 'OpenAPI', 'PWA'],
    role: 'Architect / Lead Frontend Developer',
    year: '2025',
    links: {},
  },
  {
    slug: 'acena',
    name: 'projects.acena.name',
    summary: 'projects.acena.summary',
    description: 'projects.acena.description',
    techStack: ['Vue.js', 'Capacitor', 'AI Integration', 'iOS/Android'],
    role: 'Senior Frontend Developer',
    year: '2024-2025',
    links: {
      demo: 'https://app.acena.cc/',
    },
  },
]
