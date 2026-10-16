import { createFileRoute } from '@tanstack/react-router';
import { ReferencePage, referenceHead } from '@/components/reference/ReferencePage';

export const Route = createFileRoute('/services/rop')({
  head: () => referenceHead('/services/rop/'),
  component: () => <ReferencePage path="/services/rop/" />,
});
