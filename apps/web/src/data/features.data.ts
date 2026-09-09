/**
 * Features Strip Data Layer
 * Strictly under 650 LOC.
 */

export interface FeatureItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: 'pen-tool' | 'folder' | 'file-down' | 'zap' | 'shield-check';
}

export const FEATURES_DATA: FeatureItem[] = [
  {
    id: 'f1',
    title: 'Minimal Interface',
    subtitle: 'Clean and intuitive',
    iconName: 'pen-tool',
  },
  {
    id: 'f2',
    title: 'Organize Easily',
    subtitle: 'Folders, favorites, recents',
    iconName: 'folder',
  },
  {
    id: 'f3',
    title: 'Export Anywhere',
    subtitle: 'PDF, HTML, DOCX, Text',
    iconName: 'file-down',
  },
  {
    id: 'f4',
    title: 'Blazing Fast',
    subtitle: 'Works instantly',
    iconName: 'zap',
  },
  {
    id: 'f5',
    title: '100% Private',
    subtitle: 'Your data stays with you',
    iconName: 'shield-check',
  },
];
