import { createFileRoute } from '@tanstack/react-router';
import { ReferencePage, referenceHead } from '@/components/reference/ReferencePage';

export const Route = createFileRoute('/contact-us')({
  head: () => referenceHead('/contact-us/'),
  component: () => <ReferencePage path="/contact-us/" />,
});
