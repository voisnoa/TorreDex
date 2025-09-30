import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import GenomePage from './GenomePage';
import ComparisonView from '../components/ComparisonView';
import RecommendationsView from '../components/RecommendationsView';
import { ComparisonPanel } from '../components/ComparisonButton.jsx';
import useSearch from '../hooks/useSearch';
import useScrollPosition from '../hooks/useScrollPosition';
import { useToast } from '../components/Toast';
import { BarChart3, Users, Sparkles } from 'lucide-react';

/**
 * Main search page component
 */
const SearchPage = () => {
  const {
    query,
    results,
    loading,
    error,
    hasSearched,
    hasMore,
    selectedUser,
    userGenomeLoading,
    userGenomeError,
    handleSearchChange,
    loadMore,
    clearSearch,
    selectUser,
    clearSelectedUser,
    retrySearch,
    totalResults,
  } = useSearch();

  const [activeTab, setActiveTab] = useState('search');
  const [viewingGenome, setViewingGenome] = useState(false);
  const [tabIndicator, setTabIndicator] = useState({ left: 0, width: 0 });
  const { showScrollToTop, scrollToTop } = useScrollPosition();
  const toast = useToast();
  const tabRefs = useRef({});

  // Update tab indicator position when active tab changes or when layout changes
  useEffect(() => {
    const updateIndicator = () => {
      const activeTabElement = tabRefs.current[activeTab];
      if (activeTabElement) {
        // Use offsetLeft and offsetWidth which work better with flexbox
        const left = activeTabElement.offsetLeft;
        const width = activeTabElement.offsetWidth;
        
        setTabIndicator({ left, width });
      }
    };

    // Update immediately
    updateIndicator();
    
    // Also update after a small delay to ensure layout is complete
    const timeoutId = setTimeout(updateIndicator, 100);
    
    // Add resize listener to recalculate on window resize
    window.addEventListener('resize', updateIndicator);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeTab, hasSearched, results.length]);

  // Handle floating action button actions
  const handleRefresh = () => {
    if (query) {
      retrySearch();
      toast.info('Refreshing search results...');
    }
  };

  const handleExport = () => {
    if (results.length === 0) {
      toast.warning('No data to export');
      return;
    }

    try {
      const dataToExport = {
        query,
        totalResults,
        results: results.map(person => ({
          name: person.name,
          username: person.username,
          headline: person.headline,
          location: person.location?.name,
          skills: person.skills?.slice(0, 5).map(s => s.name),
          verified: person.verified,
          openToWork: person.openToWork,
        })),
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `torre-search-${query.replace(/\s+/g, '-')}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleShare = () => {
    if (results.length === 0) {
      toast.warning('No results to share');
      return;
    }

    const shareData = {
      title: `Torre Search Results for "${query}"`,
      text: `Found ${totalResults} professionals matching "${query}" on Torre`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        // Fallback to clipboard
        copyToClipboard(shareData.url);
      });
    } else {
      copyToClipboard(shareData.url);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const handleViewGenome = (person) => {
    selectUser(person);
    setViewingGenome(true);
    // Scroll to top when viewing genome
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSearch = () => {
    setViewingGenome(false);
    clearSelectedUser();
    // Re-enable body scroll
    document.body.style.overflow = 'unset';
  };

  // Show GenomePage if viewing a genome
  if (viewingGenome) {
    return (
      <GenomePage
        user={selectedUser}
        loading={userGenomeLoading}
        error={userGenomeError}
        onBack={handleBackToSearch}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col h-full" style={{ backgroundColor: 'var(--torre-bg-primary)' }}>
      {/* Search Section with Conditional Animation */}
      <motion.div 
        className={`flex flex-col items-center px-4 sm:px-6 lg:px-8 ${hasSearched || results.length > 0 ? 'pt-8 sm:pt-10 lg:pt-12' : 'flex-1 justify-center pt-16 sm:pt-20 lg:pt-24'}`}
        animate={{
          y: hasSearched || results.length > 0 ? 0 : 0,
          transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
        }}
      >
        {/* Search Bar - Show only on search tab with smooth animation */}
        <motion.div 
          className="max-w-2xl w-full mx-auto mb-4 sm:mb-6 lg:mb-8 px-4"
          animate={{
            y: hasSearched || results.length > 0 ? -30 : 0,
            opacity: activeTab === 'search' ? 1 : 0,
            height: activeTab === 'search' ? 'auto' : 0,
            marginBottom: activeTab === 'search' ? 32 : 0,
            transition: { 
              duration: 0.6, 
              ease: [0.4, 0, 0.2, 1],
              opacity: { duration: 0.4 },
              height: { duration: 0.5 },
              marginBottom: { duration: 0.5 }
            }
          }}
          style={{
            overflow: activeTab === 'search' ? 'visible' : 'hidden'
          }}
        >
          {activeTab === 'search' && (
            <SearchBar
              query={query}
              onQueryChange={handleSearchChange}
              loading={loading}
              onClear={clearSearch}
              placeholder="Search for people on Torre..."
            />
          )}
        </motion.div>
      </motion.div>

      {/* Main Content - Takes full screen when there are results */}
      <motion.main 
        className={`bg-white dark:bg-gray-800 border-t ${results.length > 0 ? 'flex-grow' : ''}`}
        style={{ 
          backgroundColor: 'var(--torre-bg-primary)', 
          borderColor: 'var(--torre-border)',
          marginTop: 'auto'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
        }}
      >
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 ${results.length > 0 ? 'h-full' : ''}`}>
          {/* Navigation Tabs */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
        <div>
          <nav className="flex justify-center space-x-4 sm:space-x-6 lg:space-x-8 relative">
            <div className="relative flex space-x-4 sm:space-x-6 lg:space-x-8">
              {/* Tab buttons with bubble indicator */}
              {[
                { id: 'search', label: 'Search', shortLabel: 'Search', icon: BarChart3 },
                { id: 'compare', label: 'Compare', shortLabel: 'Compare', icon: Users },
                { id: 'recommendations', label: 'Recommendations', shortLabel: 'Recommend', icon: Sparkles }
              ].map((tab, index) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  ref={(el) => (tabRefs.current[tab.id] = el)}
                  onClick={() => setActiveTab(tab.id)}
                  title=""
                  className={`flex items-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm transition-all duration-200 rounded-full relative min-w-0 flex-shrink-0 ${
                    activeTab === tab.id 
                      ? 'bg-[var(--torre-accent-light)] text-[var(--torre-accent)]' 
                      : 'text-[var(--torre-text-muted)] hover:text-[var(--torre-text-primary)]'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden truncate">{tab.shortLabel}</span>
                </motion.button>
              );
            })}
            </div>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'search' && (
        <div className={`${results.length > 0 ? 'h-full pb-16 sm:pb-20 lg:pb-24 overflow-auto' : 'min-h-full pb-16 sm:pb-20 lg:pb-24 overflow-auto'}`}>
          <SearchResults
            results={results}
            loading={loading}
            error={error}
            query={query}
            hasSearched={hasSearched}
            hasMore={hasMore}
            totalResults={totalResults}
            onLoadMore={loadMore}
            onPersonClick={handleViewGenome}
            onRetry={retrySearch}
            onClear={clearSearch}
          />
        </div>
      )}

      {activeTab === 'compare' && (
        <div className="min-h-full pb-24 overflow-auto">
          <ComparisonView />
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="min-h-full pb-24 overflow-auto">
          <RecommendationsView onViewGenome={handleViewGenome} onSwitchToCompare={() => setActiveTab('compare')} />
        </div>
      )}
        </div>
      </motion.main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="border-t mt-24"
        style={{
          backgroundColor: 'var(--torre-bg-primary)',
          borderColor: 'var(--torre-border)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-sm" style={{ color: 'var(--torre-text-muted)' }}>
            <p>
              Built with Torre API • Powered by React & Tailwind CSS
            </p>
            <p className="mt-2">
              A Pokédex for the global talent network{' '}
              <a
                href="https://torre.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium transition-colors duration-200"
                style={{ color: 'var(--torre-accent)' }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--torre-accent-dark)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--torre-accent)';
                }}
              >
                Torre.ai
              </a>
            </p>
          </div>
        </div>
      </motion.footer>

      {/* User Profile Modal */}
      {/* Floating Action Button */}
      
      {/* Comparison Panel - only show on search tab */}
      {activeTab === 'search' && (
        <ComparisonPanel onNavigateToCompare={() => setActiveTab('compare')} />
      )}
    </div>
  );
};

export default SearchPage;
