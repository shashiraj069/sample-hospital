import { createFileRoute } from '@tanstack/react-router';
import { ReferencePage, referenceHead } from '@/components/reference/ReferencePage';

export const Route = createFileRoute('/appointment')({
  head: () => referenceHead('/appointment/'),
  component: () => <ReferencePage path="/appointment/" />,
});
