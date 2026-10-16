import { createFileRoute } from '@tanstack/react-router';
import { ReferencePage, referenceHead } from '@/components/reference/ReferencePage';

export const Route = createFileRoute('/services/glaucoma')({
  head: () => referenceHead('/services/glaucoma/'),
  component: () => <ReferencePage path="/services/glaucoma/" />,
});
