import { createFileRoute } from "@tanstack/react-router";
import { ReferencePage, referenceHead } from '@/components/reference/ReferencePage';
export const Route = createFileRoute("/")({
  head: () => referenceHead('/'),
  component: () => <ReferencePage path="/" />,
});
