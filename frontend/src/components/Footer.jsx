import React from 'react';
import { Github, Heart, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-github-border bg-github-dark py-8 mt-16 text-github-muted text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center space-x-2">
          <Github className="w-5 h-5 text-blue-400" />
          <span className="font-semibold text-white">GitHub Profile Analyzer</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>

        <div className="flex items-center space-x-6 text-xs">
          <span className="flex items-center space-x-1">
            <span>Built with React, Flask & official GitHub REST API</span>
          </span>
          <a 
            href="https://docs.github.com/en/rest" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            GitHub REST API v3
          </a>
        </div>

      </div>
    </footer>
  );
}
