import { notFound } from 'next/navigation';

/**
 * Catch-all route that triggers the not-found page
 * Any unmatched routes will hit this and show the custom 404 page
 */
export default function CatchAll() {
  notFound();
}
