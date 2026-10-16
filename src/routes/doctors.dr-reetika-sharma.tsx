import { createFileRoute } from '@tanstack/react-router';
import { ReferencePage, referenceHead } from '@/components/reference/ReferencePage';

export const Route = createFileRoute('/doctors/dr-reetika-sharma')({
  head: () => referenceHead('/doctors/dr-reetika-sharma/'),
  component: () => <ReferencePage path="/doctors/dr-reetika-sharma/" />,
});
