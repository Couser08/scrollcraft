/**
 * Mockup Data and Annotation Cards Data Layer
 * Strictly under 650 LOC.
 */

export interface PointerCardData {
  id: string;
  title: string;
  subtitle: string;
  icon: 'zap' | 'layout-template' | 'upload-cloud';
  accentColor: 'blue' | 'emerald' | 'purple';
  position: 'top-left' | 'bottom-left' | 'bottom-right';
}

export const POINTER_CARDS: PointerCardData[] = [
  {
    id: 'pc-1',
    title: 'Fast & Distraction Free',
    subtitle: 'Focus on what matters.',
    icon: 'zap',
    accentColor: 'blue',
    position: 'top-left',
  },
  {
    id: 'pc-2',
    title: 'Beautiful Templates',
    subtitle: 'Notes, docs, resumes & more.',
    icon: 'layout-template',
    accentColor: 'emerald',
    position: 'bottom-left',
  },
  {
    id: 'pc-3',
    title: 'Export Anywhere',
    subtitle: 'PDF, HTML, DOCX and more.',
    icon: 'upload-cloud',
    accentColor: 'purple',
    position: 'bottom-right',
  },
];

export const MOCKUP_DOCUMENT = {
  title: 'Ideas that matter',
  quote: 'Small steps create big changes.',
  tasks: [
    { label: 'Write', checked: true },
    { label: 'Learn', checked: true },
    { label: 'Build', checked: false },
    { label: 'Repeat', checked: false },
  ],
};
