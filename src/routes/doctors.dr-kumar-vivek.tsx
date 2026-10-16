import { createFileRoute } from '@tanstack/react-router';
import { ReferencePage, referenceHead } from '@/components/reference/ReferencePage';

export const Route = createFileRoute('/doctors/dr-kumar-vivek')({
  head: () => referenceHead('/doctors/dr-kumar-vivek/'),
  component: () => <ReferencePage path="/doctors/dr-kumar-vivek/" />,
});
