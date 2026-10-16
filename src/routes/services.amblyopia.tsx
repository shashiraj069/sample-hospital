import { createFileRoute } from '@tanstack/react-router';
import { ReferencePage, referenceHead } from '@/components/reference/ReferencePage';

export const Route = createFileRoute('/services/amblyopia')({
  head: () => referenceHead('/services/amblyopia/'),
  component: () => <ReferencePage path="/services/amblyopia/" />,
});
