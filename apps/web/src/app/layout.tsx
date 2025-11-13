import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dingo - Smart Lawyer Ratings',
  description: 'Find and rate the best lawyers with intelligent metrics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
