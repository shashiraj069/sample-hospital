import { createFileRoute } from '@tanstack/react-router';
import { ReferencePage, referenceHead } from '@/components/reference/ReferencePage';

export const Route = createFileRoute('/about')({
  head: () => referenceHead('/about/'),
  component: () => <ReferencePage path="/about/" />,
});
