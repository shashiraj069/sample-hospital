import { createFileRoute } from '@tanstack/react-router';
import { ReferencePage, referenceHead } from '@/components/reference/ReferencePage';

export const Route = createFileRoute('/doctors/dr-drishti-kumari')({
  head: () => referenceHead('/doctors/dr-drishti-kumari/'),
  component: () => <ReferencePage path="/doctors/dr-drishti-kumari/" />,
});
