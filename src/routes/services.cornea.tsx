import { createFileRoute } from '@tanstack/react-router';
import { ReferencePage, referenceHead } from '@/components/reference/ReferencePage';

export const Route = createFileRoute('/services/cornea')({
  head: () => referenceHead('/services/cornea/'),
  component: () => <ReferencePage path="/services/cornea/" />,
});
