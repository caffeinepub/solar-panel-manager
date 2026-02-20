import { SiCaffeine } from 'react-icons/si';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'solar-manager';

  return (
    <footer className="border-t bg-background py-6 mb-16 md:mb-0">
      <div className="container px-4 text-center text-sm text-muted-foreground">
        <p>
          © {currentYear} Solar Manager. Built with{' '}
          <SiCaffeine className="inline h-4 w-4 text-chart-1" /> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
