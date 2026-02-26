export interface Project {
  slug: string;
  name: string;
  description: string;
  techStack: string[];
  role: string;
  year: string;
  summary: string;
  links: {
    demo?: string;
    github?: string;
    case?: string;
  };
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  skills: string[];
  location: string;
  status: string;
  asciiPortrait?: string;
}

export interface Course {
  slug: string;
  title: string;
  provider: string;
  status: 'completed' | 'ongoing';
  year: string;
}
