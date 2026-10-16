import { createFileRoute } from '@tanstack/react-router';
import { ReferencePage, referenceHead } from '@/components/reference/ReferencePage';

export const Route = createFileRoute('/services/retinal-detachment')({
  head: () => referenceHead('/services/retinal-detachment/'),
  component: () => <ReferencePage path="/services/retinal-detachment/" />,
});
