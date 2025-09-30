import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  TrendingUp,
  Award,
  Target,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Lightbulb,
  Search,
  Plus,
  User,
  UserPlus,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext.jsx';
import Avatar from './Avatar.jsx';
import SearchBar from './SearchBar.jsx';
import SearchResults from './SearchResults.jsx';
import StarRating from './StarRating.jsx';
import useSearch from '../hooks/useSearch.js';

const ComparisonView = () => {
  const { 
    comparisons, 
    selectedPeople, 
    isLoading, 
    error, 
    addPersonToComparison, 
    clearComparison,
    compareSelectedPeople 
  } = useComparison();

  // Step-by-step flow state
  const [step, setStep] = useState('initial'); // 'initial', 'first-search', 'second-search', 'analyzing', 'comparison'
  const [firstPerson, setFirstPerson] = useState(null);
  const [secondPerson, setSecondPerson] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Search hooks for each step
  const firstSearch = useSearch();
  const secondSearch = useSearch();
  const addMoreSearch = useSearch();

  // Handle person selection in different steps
  const handlePersonSelect = (data) => {
    // Extract person from the data structure passed by SearchResults
    const person = data.person || data;
    
    if (step === 'first-search') {
      setFirstPerson(person);
      addPersonToComparison(person);
      setStep('second-search');
    } else if (step === 'second-search') {
      setSecondPerson(person);
      addPersonToComparison(person);
      setStep('analyzing');
      // Start comparison after a short delay
      setTimeout(() => {
        compareSelectedPeople().then(() => {
          setStep('comparison');
        });
      }, 1000);
    } else if (step === 'add-more') {
      addPersonToComparison(person);
    }
  };

  // Reset flow when clearing comparison
  useEffect(() => {
    if (selectedPeople.length === 0) {
      setStep('initial');
      setFirstPerson(null);
      setSecondPerson(null);
    }
    // Only auto-start comparison if we're on initial step AND have existing comparisons
    // This handles the case where user comes from comparison panel with pre-existing data
    else if (selectedPeople.length >= 2 && comparisons.length > 0 && step === 'initial') {
      setStep('comparison');
      setFirstPerson(selectedPeople[0]);
      setSecondPerson(selectedPeople[1]);
    }
  }, [selectedPeople.length, comparisons.length]); // Remove step from dependencies to prevent conflicts

  // Initial state - no people selected
  if (step === 'initial') {
    return (
      <div className="text-center py-8 sm:py-12 lg:py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Users className="mx-auto mb-4 sm:mb-6" style={{ color: 'var(--torre-text-muted)' }} size={48} />
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: 'var(--torre-text-primary)' }}>
            Compare Torre Professionals
          </h3>
          <p className="text-base sm:text-lg mb-6 sm:mb-8" style={{ color: 'var(--torre-text-secondary)' }}>
            Discover similarities, differences, and complementary skills between professionals
          </p>

          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-1 inline-block">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setStep('first-search');
              }}
              className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg w-full"
              style={{
                backgroundColor: 'white',
                color: '#000000',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Search size={18} className="sm:w-5 sm:h-5" />
              Start Comparing
            </button>
          </div>
        </div>
      </div>
    );
  }

  // First person search step
  if (step === 'first-search') {
    return (
      <div className="space-y-4 sm:space-y-6 px-4">
        {/* Back button */}
        <div className="flex justify-start">
          <button
            onClick={() => setStep('initial')}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ color: 'var(--torre-text-secondary)' }}
          >
            <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
            Back
          </button>
        </div>

        {/* Header */}
        <div className="text-center py-2 sm:py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 sm:space-y-4"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <User style={{ color: 'var(--torre-accent)' }} size={24} className="sm:w-8 sm:h-8" />
              <h3 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--torre-text-primary)' }}>
                Select First Person
              </h3>
            </div>
            <p className="text-sm sm:text-base" style={{ color: 'var(--torre-text-secondary)' }}>
              Search for the first professional you want to compare
            </p>
          </motion.div>
        </div>

        {/* Search Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 sm:space-y-6"
        >
          <div className="max-w-2xl mx-auto">
            <SearchBar
              query={firstSearch.query}
              onQueryChange={firstSearch.handleSearchChange}
              loading={firstSearch.loading}
              onClear={firstSearch.clearSearch}
              placeholder="Search for first person..."
            />
          </div>
          
          <div className="min-h-screen pb-16 sm:pb-20 lg:pb-24">
            <SearchResults
              results={firstSearch.results}
              loading={firstSearch.loading}
              error={firstSearch.error}
              query={firstSearch.query}
              hasSearched={firstSearch.hasSearched}
              hasMore={firstSearch.hasMore}
              totalResults={firstSearch.totalResults}
              onLoadMore={firstSearch.loadMore}
              onPersonClick={handlePersonSelect}
              onRetry={firstSearch.retrySearch}
              onClear={firstSearch.clearSearch}
              showAddButton={false}
              selectButtonText="Select for Comparison"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  // Second person search step
  if (step === 'second-search') {
    return (
      <div className="space-y-6">
        {/* Back button */}
        <div className="flex justify-start">
          <button
            onClick={() => {
              setStep('first-search');
              setFirstPerson(null);
              clearComparison();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ color: 'var(--torre-text-secondary)' }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        {/* Progress indicator */}
        <div className="text-center py-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="flex items-center gap-2">
              <CheckCircle style={{ color: 'var(--torre-green)' }} size={20} />
              <span className="text-sm font-medium" style={{ color: 'var(--torre-text-secondary)' }}>
                {firstPerson?.name}
              </span>
            </div>
            <ArrowRight style={{ color: 'var(--torre-text-muted)' }} size={16} />
            <div className="flex items-center gap-2">
              <UserPlus style={{ color: 'var(--torre-accent)' }} size={20} />
              <span className="text-sm font-medium" style={{ color: 'var(--torre-text-secondary)' }}>
                Select second person
              </span>
            </div>
          </motion.div>
        </div>

        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold" style={{ color: 'var(--torre-text-primary)' }}>
              Select Second Person
            </h3>
            <p style={{ color: 'var(--torre-text-secondary)' }}>
              Search for the second professional to compare with {firstPerson?.name}
            </p>
          </motion.div>
        </div>

        {/* Search Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="max-w-2xl mx-auto">
            <SearchBar
              query={secondSearch.query}
              onQueryChange={secondSearch.handleSearchChange}
              loading={secondSearch.loading}
              onClear={secondSearch.clearSearch}
              placeholder="Search for second person..."
            />
          </div>
          
          <div className="min-h-screen pb-24">
            <SearchResults
              results={secondSearch.results}
              loading={secondSearch.loading}
              error={secondSearch.error}
              query={secondSearch.query}
              hasSearched={secondSearch.hasSearched}
              hasMore={secondSearch.hasMore}
              totalResults={secondSearch.totalResults}
              onLoadMore={secondSearch.loadMore}
              onPersonClick={handlePersonSelect}
              onRetry={secondSearch.retrySearch}
              onClear={secondSearch.clearSearch}
              showAddButton={false}
              selectButtonText="Compare Now"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  // Analyzing step - custom animation for comparison
  if (step === 'analyzing') {
    return (
      <div className="text-center py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6 max-w-md mx-auto"
        >
          {/* Animated analyzing icon */}
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-20 h-20 mx-auto rounded-full border-4 border-t-transparent"
            style={{ borderColor: 'var(--torre-accent)', borderTopColor: 'transparent' }}
          />
          
          <motion.h3 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold" 
            style={{ color: 'var(--torre-text-primary)' }}
          >
            Analyzing Professionals
          </motion.h3>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg" 
            style={{ color: 'var(--torre-text-secondary)' }}
          >
            Comparing skills, experience, and compatibility between professionals...
          </motion.p>
          
          {/* Progress indicators */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-6 mt-8"
          >
            <div className="flex items-center gap-3">
              <Avatar person={firstPerson} size="md" />
              <span className="font-medium" style={{ color: 'var(--torre-text-secondary)' }}>
                {firstPerson?.name}
              </span>
            </div>
            
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ color: 'var(--torre-accent)' }}
            >
              <ArrowRight size={24} />
            </motion.div>
            
            <div className="flex items-center gap-3">
              <Avatar person={secondPerson} size="md" />
              <span className="font-medium" style={{ color: 'var(--torre-text-secondary)' }}>
                {secondPerson?.name}
              </span>
            </div>
          </motion.div>

          {/* Analyzing steps */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="space-y-2 text-sm"
            style={{ color: 'var(--torre-text-muted)' }}
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              • Fetching professional genomes...
            </motion.div>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
            >
              • Analyzing skill compatibility...
            </motion.div>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, delay: 1, repeat: Infinity }}
            >
              • Computing similarity scores...
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto" 
               style={{ borderColor: 'var(--torre-accent)', borderTopColor: 'transparent' }} />
          <h3 className="text-xl font-bold" style={{ color: 'var(--torre-text-primary)' }}>
            Analyzing People...
          </h3>
          <p style={{ color: 'var(--torre-text-secondary)' }}>
            Fetching professional data and comparing skills, experience, and strengths between {firstPerson?.name || selectedPeople[0]?.name} and {secondPerson?.name || selectedPeople[1]?.name}...
          </p>
          
          {/* Progress indicators */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="flex items-center gap-2">
              <Avatar person={firstPerson} size="sm" />
              <span className="text-sm font-medium" style={{ color: 'var(--torre-text-secondary)' }}>
                {firstPerson?.name}
              </span>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <ArrowRight style={{ color: 'var(--torre-accent)' }} size={20} />
            </motion.div>
            <div className="flex items-center gap-2">
              <Avatar person={secondPerson} size="sm" />
              <span className="text-sm font-medium" style={{ color: 'var(--torre-text-secondary)' }}>
                {secondPerson?.name}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-16">
        <XCircle className="mx-auto mb-6" style={{ color: '#ef4444' }} size={64} />
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--torre-text-primary)' }}>
          Comparison Error
        </h3>
        <p className="mb-6" style={{ color: '#ef4444' }}>
          {error}
        </p>
        <button
          onClick={() => {
            setStep('initial');
            clearComparison();
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all"
          style={{
            backgroundColor: 'var(--torre-accent)',
            color: '#000000'
          }}
        >
          Start Over
        </button>
      </div>
    );
  }

  // Comparison results state
  if (step === 'comparison' && comparisons.length > 0) {
    const comparison = comparisons[0]; // Get the first comparison
    
    const tabs = [
      { id: 'overview', label: 'Overview', icon: BarChart3 },
      { id: 'skills', label: 'Skills Analysis', icon: Target },
      { id: 'insights', label: 'Insights', icon: Lightbulb }
    ];

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          duration: 0.6,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        className="space-y-6"
      >
        {/* Header with Add People option */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="rounded-2xl shadow-xl p-6 bg-gradient-to-r from-blue-500 to-purple-600"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                <Users size={28} />
                Professional Comparison
              </h2>
              <p className="mt-1 flex items-center gap-2 text-blue-100">
                Analyzing {selectedPeople.length} professionals • 
                <StarRating 
                  rating={(comparison.similarity?.overallScore || 0) * 5} 
                  size={14} 
                  color="white" 
                  showRating={false} 
                />
                compatibility
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                onClick={() => setStep('add-more')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-white text-blue-600 hover:bg-blue-50"
              >
                <Plus size={16} />
                Add People
              </button>

              <button
                onClick={() => {
                  setStep('initial');
                  clearComparison();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
              >
                Start Over
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? 'white' : 'rgba(255, 255, 255, 0.2)',
                    color: isActive ? '#4F46E5' : 'white',
                  }}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="rounded-2xl shadow-xl p-6 bg-white dark:bg-gray-800"
        >
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <OverviewTab comparison={comparison} />
              </motion.div>
            )}
            {activeTab === 'skills' && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <SkillsTab comparison={comparison} />
              </motion.div>
            )}
            {activeTab === 'insights' && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <InsightsTab comparison={comparison} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    );
  }

  // Add more people step
  if (step === 'add-more') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-3">
              <Plus style={{ color: 'var(--torre-accent)' }} size={32} />
              <h3 className="text-xl font-bold" style={{ color: 'var(--torre-text-primary)' }}>
                Add More People
              </h3>
            </div>
            <p style={{ color: 'var(--torre-text-secondary)' }}>
              Search for additional professionals to include in the comparison
            </p>
          </motion.div>
        </div>

        {/* Current selection */}
        <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--torre-bg-tertiary)', borderColor: 'var(--torre-border)' }}>
          <h4 className="font-semibold mb-3" style={{ color: 'var(--torre-text-primary)' }}>
            Currently Comparing ({selectedPeople.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedPeople.map((person) => (
              <div key={person.username} className="flex items-center gap-2 px-3 py-1 rounded-full text-sm" 
                   style={{ backgroundColor: 'var(--torre-bg-secondary)', border: '1px solid var(--torre-border)' }}>
                <Avatar person={person} size="xs" />
                <span style={{ color: 'var(--torre-text-secondary)' }}>{person.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Search Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="max-w-2xl mx-auto">
            <SearchBar
              query={addMoreSearch.query}
              onQueryChange={addMoreSearch.handleSearchChange}
              loading={addMoreSearch.loading}
              onClear={addMoreSearch.clearSearch}
              placeholder="Search for more people to add..."
            />
          </div>
          
          <div className="min-h-screen pb-24">
            <SearchResults
              results={addMoreSearch.results}
              loading={addMoreSearch.loading}
              error={addMoreSearch.error}
              query={addMoreSearch.query}
              hasSearched={addMoreSearch.hasSearched}
              hasMore={addMoreSearch.hasMore}
              totalResults={addMoreSearch.totalResults}
              onLoadMore={addMoreSearch.loadMore}
              onPersonClick={handlePersonSelect}
              onRetry={addMoreSearch.retrySearch}
              onClear={addMoreSearch.clearSearch}
              showAddButton={false}
              selectButtonText="Add to Comparison"
              excludeUsernames={selectedPeople.map(p => p.username)}
            />
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep('comparison')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ color: 'var(--torre-text-secondary)' }}
          >
            <ArrowLeft size={16} />
            Back to Comparison
          </button>

          {selectedPeople.length >= 2 && (
            <button
              onClick={() => {
                setStep('comparison');
                compareSelectedPeople();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all"
              style={{
                backgroundColor: 'var(--torre-accent)',
                color: '#000000'
              }}
            >
              Update Comparison
            </button>
          )}
        </div>
      </div>
    );
  }

  // Fallback - only show when truly no people are selected
  if (selectedPeople.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto mb-4" style={{ color: 'var(--torre-accent)' }} size={48} />
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--torre-text-primary)' }}>
          Ready to Compare
        </h3>
        <p style={{ color: 'var(--torre-text-secondary)' }}>
          Select people to start comparing their professional profiles
        </p>
      </div>
    );
  }

  // If we have people selected but no step matches, default to initial step
  return (
    <div className="text-center py-16">
      <Users className="mx-auto mb-6" style={{ color: 'var(--torre-text-muted)' }} size={64} />
      <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--torre-text-primary)' }}>
        Compare Torre Professionals
      </h3>
      <p className="text-lg mb-8" style={{ color: 'var(--torre-text-secondary)' }}>
        Discover similarities, differences, and complementary skills between professionals
      </p>

      <motion.button
        onClick={() => {
          console.log('Fallback Start Comparing button clicked, current step:', step);
          setStep('first-search');
        }}
        className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200"
        style={{
          backgroundColor: 'var(--torre-accent)',
          color: '#000000'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'var(--torre-accent-dark)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'var(--torre-accent)';
        }}
      >
        <Search size={20} />
        Start Comparing
      </motion.button>
    </div>
  );
};

// Tab Components with Horizontal Bar Graphs
const OverviewTab = ({ comparison }) => {
  const person1 = comparison.person1;
  const person2 = comparison.person2;
  
  return (
    <div className="space-y-6">
      {/* People Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PersonOverview person={person1} title="Person 1" comparison={comparison} isFirst={true} />
        <PersonOverview person={person2} title="Person 2" comparison={comparison} isFirst={false} />
      </div>

      {/* Overall Compatibility with Modern Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Overall Match</h3>
              <p className="text-green-100 text-sm">Compatibility Score</p>
            </div>
            <TrendingUp size={24} />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold">
              {Math.round((comparison.similarity?.overallScore || 0) * 100)}%
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Skills</h3>
              <p className="text-blue-100 text-sm">Similarity</p>
            </div>
            <Target size={24} />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold">
              {Math.round((comparison.similarity?.skillsScore || 0) * 100)}%
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Strengths</h3>
              <p className="text-purple-100 text-sm">Alignment</p>
            </div>
            <Award size={24} />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold">
              {Math.round((comparison.similarity?.strengthsScore || 0) * 100)}%
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Experience</h3>
              <p className="text-amber-100 text-sm">Level Match</p>
            </div>
            <BarChart3 size={24} />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold">
              {Math.round((comparison.similarity?.experienceScore || 0) * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkillsTab = ({ comparison }) => {
  const commonSkills = comparison.similarity?.details?.commonSkills || [];
  const uniqueSkills1 = comparison.similarity?.details?.uniqueSkills1 || [];
  const uniqueSkills2 = comparison.similarity?.details?.uniqueSkills2 || [];

  return (
    <div className="space-y-6">
      {/* Common Skills */}
      {commonSkills.length > 0 && (
        <div className="rounded-2xl border p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 border-blue-200 dark:border-gray-600">
          <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <CheckCircle size={24} />
            Common Skills ({commonSkills.length})
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {commonSkills.slice(0, 12).map((skill, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm border border-blue-100 dark:border-gray-600 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-base font-medium text-gray-800 dark:text-gray-200">
                    {skill.name}
                  </span>
                </div>
              </motion.div>
            ))}
            {commonSkills.length > 12 && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm border border-blue-100 dark:border-gray-600 flex items-center justify-center transition-all"
              >
                <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                  +{commonSkills.length - 12} more
                </span>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Unique Skills Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {/* Person 1 Unique Skills */}
        <div className="rounded-3xl border p-7 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 border-green-200 dark:border-gray-600 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
              <User className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <h3 className="font-bold text-2xl text-green-700 dark:text-green-300">
              {comparison.person1?.name}'s Unique Skills
            </h3>
          </div>
          
          <div className="space-y-3">
            {uniqueSkills1.slice(0, 8).map((skill, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm border border-green-100 dark:border-gray-600 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-base font-medium text-gray-800 dark:text-gray-200">
                    {skill.name}
                  </span>
                </div>
              </motion.div>
            ))}
            {uniqueSkills1.length === 0 && (
              <p className="text-base italic text-gray-500 dark:text-gray-400">
                No unique skills found
              </p>
            )}
            {uniqueSkills1.length > 8 && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm border border-green-100 dark:border-gray-600 transition-all"
              >
                <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                  +{uniqueSkills1.length - 8} more unique skills
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Person 2 Unique Skills */}
        <div className="rounded-3xl border p-7 bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-gray-700 dark:to-gray-800 border-purple-200 dark:border-gray-600 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
              <User className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <h3 className="font-bold text-2xl text-purple-700 dark:text-purple-300">
              {comparison.person2?.name}'s Unique Skills
            </h3>
          </div>
          
          <div className="space-y-3">
            {uniqueSkills2.slice(0, 8).map((skill, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm border border-purple-100 dark:border-gray-600 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-base font-medium text-gray-800 dark:text-gray-200">
                    {skill.name}
                  </span>
                </div>
              </motion.div>
            ))}
            {uniqueSkills2.length === 0 && (
              <p className="text-base italic text-gray-500 dark:text-gray-400">
                No unique skills found
              </p>
            )}
            {uniqueSkills2.length > 8 && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm border border-purple-100 dark:border-gray-600 transition-all"
              >
                <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                  +{uniqueSkills2.length - 8} more unique skills
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InsightsTab = ({ comparison }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {/* Collaboration Potential */}
        <div className="rounded-3xl border p-7 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-800 border-amber-200 dark:border-gray-600 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <Target className="text-amber-600 dark:text-amber-400" size={24} />
            </div>
            <h3 className="font-bold text-2xl text-amber-700 dark:text-amber-300">
              Collaboration Potential
            </h3>
          </div>
          
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="mt-1 w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100">Strong technical alignment</h4>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Both professionals share core technical skills</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 w-3 h-3 rounded-full bg-blue-500 flex-shrink-0"></div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100">Complementary skill sets</h4>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Unique skills from each person fill gaps</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 w-3 h-3 rounded-full bg-purple-500 flex-shrink-0"></div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100">Similar experience levels</h4>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Both have comparable years of experience</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Recommendations */}
        <div className="rounded-3xl border p-7 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-700 dark:to-gray-800 border-emerald-200 dark:border-gray-600 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <Award className="text-emerald-600 dark:text-emerald-400" size={24} />
            </div>
            <h3 className="font-bold text-2xl text-emerald-700 dark:text-emerald-300">
              Recommendations
            </h3>
          </div>
          
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div className="bg-white dark:bg-gray-700 rounded-xl p-5 shadow-sm border border-emerald-100 dark:border-gray-600">
              <p>These professionals would work well together on technical projects due to their complementary skills.</p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-xl p-5 shadow-sm border border-emerald-100 dark:border-gray-600">
              <p>Consider pairing them for mentorship opportunities to leverage their different strengths.</p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-xl p-5 shadow-sm border border-emerald-100 dark:border-gray-600">
              <p>Strong potential for knowledge sharing and mutual professional growth.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Button */}
      <div className="text-center pt-6">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl"
        >
          <Sparkles size={24} />
          Generate Detailed Report
        </motion.button>
      </div>
    </div>
  );
};

// Helper Components
const PersonOverview = ({ person, title, comparison = null, isFirst = false }) => {
  // Calculate common skills for this person if comparison data is available
  const commonSkillsCount = comparison?.similarity?.details?.commonSkills?.length || 0;
  const totalSkills = person?.skills?.length || 0;
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="rounded-2xl border p-7 h-full flex flex-col shadow-lg bg-white dark:bg-gray-800"
    >
      <h3 className="font-bold text-2xl mb-5 text-gray-900 dark:text-white">
        {title}
      </h3>
      
      <div className="flex items-center gap-5 mb-5">
        <Avatar person={person} size="lg" />
        <div className="flex-1">
          <h4 className="font-bold text-xl text-gray-900 dark:text-white">
            {person?.name}
          </h4>
          <p className="text-base text-gray-600 dark:text-gray-300 mt-1">
            @{person?.username}
          </p>
          {person?.verified && (
            <div className="flex items-center gap-1 mt-2">
              <CheckCircle className="text-green-500" size={16} />
              <span className="text-xs text-green-600 dark:text-green-400">Verified</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 mb-5">
        <p className="text-gray-700 dark:text-gray-300">
          {person?.professionalHeadline || 'Professional'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 text-base mt-auto pt-5 border-t border-gray-200 dark:border-gray-700">
        <div>
          <span className="text-gray-500 dark:text-gray-400">
            {comparison ? 'Common Skills' : 'Skills'}
          </span>
          <div className="font-bold text-xl text-gray-900 dark:text-white mt-1">
            {comparison ? `${commonSkillsCount}/${totalSkills}` : (totalSkills || 0)}
          </div>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Strengths</span>
          <div className="font-bold text-xl text-gray-900 dark:text-white mt-1">
            {person?.strengths?.length || 0}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SkillBar = ({ label, value, color, showPercentage = false }) => {
  const percentage = Math.round(value * 100);
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="font-bold text-base text-gray-900 dark:text-white">
          {label}
        </span>
        {showPercentage && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {percentage}%
          </span>
        )}
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      
      <div className="text-right">
        <span className="text-sm font-bold" style={{ color }}>
          {percentage}%
        </span>
      </div>
    </div>
  );
};

const SkillComparisonBar = ({ skill1, skill2, person1Name, person2Name }) => {
  const max = Math.max(skill1, skill2);
  const percentage1 = (skill1 / max) * 100;
  const percentage2 = (skill2 / max) * 100;
  
  return (
    <div className="space-y-3">
      {/* Person 1 */}
      <div className="flex items-center gap-3">
        <span className="text-sm w-24 truncate text-gray-600 dark:text-gray-400">
          {person1Name}
        </span>
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage1}%` }}
            transition={{ duration: 0.6 }}
            className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600"
          />
        </div>
        <span className="text-sm w-10 text-gray-600 dark:text-gray-400">
          {Math.round(skill1 * 100)}%
        </span>
      </div>
      
      {/* Person 2 */}
      <div className="flex items-center gap-3">
        <span className="text-sm w-24 truncate text-gray-600 dark:text-gray-400">
          {person2Name}
        </span>
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage2}%` }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-purple-600"
          />
        </div>
        <span className="text-sm w-10 text-gray-600 dark:text-gray-400">
          {Math.round(skill2 * 100)}%
        </span>
      </div>
    </div>
  );
};

export default ComparisonView;