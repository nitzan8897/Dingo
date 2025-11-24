import Image from 'next/image';

interface LawyersHeaderProps {
  title: string;
  subtitle: string;
}

/**
 * Lawyers page header with logo and title
 */
const LawyersHeader: React.FC<LawyersHeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="mb-12 text-center">
      <div className="flex items-center justify-center gap-6 mb-4">
        <Image
          src="/images/dingo-logo.png"
          alt="Dingo Logo"
          width={128}
          height={128}
          className="object-contain"
        />
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
      </div>
      <p className="text-xl text-gray-600 dark:text-gray-300">
        {subtitle}
      </p>
    </header>
  );
};

export default LawyersHeader;
