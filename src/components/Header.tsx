import { ExternalLink, Github } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Agent Card Visualizer</h1>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://a2a-protocol.org"
            target="_blank"
            className="flex items-center gap-1 px-3 py-1 text-sm text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-muted"
          >
            A2A Protocol Website
            <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://github.com/samueljh1/agent-card-visualizer"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-muted"
            aria-label="View source on GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
    </header>
  );
}