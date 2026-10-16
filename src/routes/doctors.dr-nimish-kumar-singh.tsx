import { createFileRoute } from '@tanstack/react-router';
import { ReferencePage, referenceHead } from '@/components/reference/ReferencePage';

export const Route = createFileRoute('/doctors/dr-nimish-kumar-singh')({
  head: () => referenceHead('/doctors/dr-nimish-kumar-singh/'),
  component: () => <ReferencePage path="/doctors/dr-nimish-kumar-singh/" />,
});
