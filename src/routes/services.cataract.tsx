import { createFileRoute } from '@tanstack/react-router';
import { ReferencePage, referenceHead } from '@/components/reference/ReferencePage';

export const Route = createFileRoute('/services/cataract')({
  head: () => referenceHead('/services/cataract/'),
  component: () => <ReferencePage path="/services/cataract/" />,
});
