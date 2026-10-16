import { createFileRoute } from '@tanstack/react-router';
import { ReferencePage, referenceHead } from '@/components/reference/ReferencePage';

export const Route = createFileRoute('/locations')({
  head: () => referenceHead('/locations/'),
  component: () => <ReferencePage path="/locations/" />,
});
