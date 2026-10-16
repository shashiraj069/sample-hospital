import { createFileRoute } from '@tanstack/react-router';
import { ReferencePage, referenceHead } from '@/components/reference/ReferencePage';

export const Route = createFileRoute('/doctors')({
  head: () => referenceHead('/doctors/'),
  component: () => <ReferencePage path="/doctors/" />,
});
