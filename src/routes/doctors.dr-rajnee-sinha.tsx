import { createFileRoute } from '@tanstack/react-router';
import { ReferencePage, referenceHead } from '@/components/reference/ReferencePage';

export const Route = createFileRoute('/doctors/dr-rajnee-sinha')({
  head: () => referenceHead('/doctors/dr-rajnee-sinha/'),
  component: () => <ReferencePage path="/doctors/dr-rajnee-sinha/" />,
});
