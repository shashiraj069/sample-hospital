import { createFileRoute } from '@tanstack/react-router';
import { ReferencePage, referenceHead } from '@/components/reference/ReferencePage';

export const Route = createFileRoute('/doctors/dr-neha-kumari')({
  head: () => referenceHead('/doctors/dr-neha-kumari/'),
  component: () => <ReferencePage path="/doctors/dr-neha-kumari/" />,
});
