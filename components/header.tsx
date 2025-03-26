import Link from 'next/link';
import { Lock } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full border-b border-border py-4">
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Lock className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Secure File Share</span>
        </Link>
        
        <nav className="flex items-center space-x-4">
          <Link 
            href="/" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Upload
          </Link>
          <Link 
            href="/about" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
} 