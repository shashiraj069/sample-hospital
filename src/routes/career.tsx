import { createFileRoute } from '@tanstack/react-router';
import { ReferencePage, referenceHead } from '@/components/reference/ReferencePage';

export const Route = createFileRoute('/career')({
  head: () => referenceHead('/career/'),
  component: () => <ReferencePage path="/career/" />,
});
