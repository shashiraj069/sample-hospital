import { createFileRoute } from '@tanstack/react-router';
import { ReferencePage, referenceHead } from '@/components/reference/ReferencePage';

export const Route = createFileRoute('/services/squint')({
  head: () => referenceHead('/services/squint/'),
  component: () => <ReferencePage path="/services/squint/" />,
});
