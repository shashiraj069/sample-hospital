import { createFileRoute } from '@tanstack/react-router';
import { ReferencePage, referenceHead } from '@/components/reference/ReferencePage';

export const Route = createFileRoute('/doctors/dr-gautam')({
  head: () => referenceHead('/doctors/dr-gautam/'),
  component: () => <ReferencePage path="/doctors/dr-gautam/" />,
});
