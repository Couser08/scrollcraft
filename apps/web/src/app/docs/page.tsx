import type { Metadata } from 'next';
import { DocsView } from '@/components/docs/docs-view';

export const metadata: Metadata = {
  title: 'Documentation — ScrollCraft React & Next.js Scroll Toolkit',
  description:
    'Complete documentation, architecture deep dive, and API reference for the ScrollCraft React scroll engine and primitives.',
};

export default function DocsPage() {
  return <DocsView />;
}
