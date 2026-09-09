/**
 * Hero Section Copy and Metadata
 * Decoupled data layer. Strictly under 650 LOC.
 */

export interface AvatarUser {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface HeroData {
  badge: {
    icon: string;
    text: string;
  };
  headline: {
    lead: string;
    highlight: string;
  };
  description: string;
  cta: {
    primaryText: string;
    primaryHref: string;
    secondaryText: string;
    secondaryHref: string;
  };
  socialProof: {
    count: string;
    text: string;
    users: AvatarUser[];
  };
}

export const HERO_DATA: HeroData = {
  badge: {
    icon: '✨',
    text: 'YOUR IDEAS, BETTER WRITTEN',
  },
  headline: {
    lead: 'Turn your ideas into',
    highlight: 'meaningful content.',
  },
  description:
    'A clean, fast and powerful Markdown editor to write, organize and export beautiful documents — all in your browser.',
  cta: {
    primaryText: 'Open Editor',
    primaryHref: '#editor',
    secondaryText: 'View Templates',
    secondaryHref: '#templates',
  },
  socialProof: {
    count: '10,000+',
    text: 'creators, students and professionals.',
    users: [
      {
        id: 'u1',
        name: 'Alex Rivera',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      },
      {
        id: 'u2',
        name: 'Marcus Chen',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      },
      {
        id: 'u3',
        name: 'Elena Rostova',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      },
      {
        id: 'u4',
        name: 'David Kim',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      },
    ],
  },
};
