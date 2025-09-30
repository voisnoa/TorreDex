import React from 'react';
import SearchPage from './pages/SearchPage';
import { ToastProvider } from './components/Toast';
import { ComparisonProvider } from './contexts/ComparisonContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ComparisonProvider>
          <div className="min-h-screen" style={{ backgroundColor: 'var(--torre-bg-primary)' }}>
            {/* Logo and Title at top-left */}
            <div 
              className="absolute top-4 left-4 flex items-center gap-2 cursor-pointer z-10"
              onClick={() => window.location.reload()}
            >
              <h1
                className="text-xl font-bold"
                style={{
                  color: 'var(--torre-text-primary)',
                }}
              >
                Torre<span style={{ color: 'var(--torre-accent)' }}>Dex</span>
              </h1>
            </div>

            {/* Fixed Theme Toggle */}
            <ThemeToggle size="md" showLabel={false} />

            <main className="h-full">
              <SearchPage />
            </main>
          </div>
        </ComparisonProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;