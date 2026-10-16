import { createFileRoute } from '@tanstack/react-router';
import { ReferencePage, referenceHead } from '@/components/reference/ReferencePage';

export const Route = createFileRoute('/services/diabetic-retinopathy')({
  head: () => referenceHead('/services/diabetic-retinopathy/'),
  component: () => <ReferencePage path="/services/diabetic-retinopathy/" />,
});
