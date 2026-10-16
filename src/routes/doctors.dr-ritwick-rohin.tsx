import { createFileRoute } from '@tanstack/react-router';
import { ReferencePage, referenceHead } from '@/components/reference/ReferencePage';

export const Route = createFileRoute('/doctors/dr-ritwick-rohin')({
  head: () => referenceHead('/doctors/dr-ritwick-rohin/'),
  component: () => <ReferencePage path="/doctors/dr-ritwick-rohin/" />,
});
