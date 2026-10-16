import { createFileRoute } from '@tanstack/react-router';
import { ReferencePage, referenceHead } from '@/components/reference/ReferencePage';

export const Route = createFileRoute('/services/icl')({
  head: () => referenceHead('/services/icl/'),
  component: () => <ReferencePage path="/services/icl/" />,
});
