import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Target,
  CheckCircle,
  Star,
  ArrowRight,
  RefreshCw,
  Filter,
  Search,
  GitCompare,
  Award,
  Zap,
  Heart,
  Globe
} from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext.jsx';
import ComparisonButton from './ComparisonButton.jsx';
import Avatar from './Avatar.jsx';

const RecommendationsView = ({ onViewGenome, onSwitchToCompare }) => {
  const { 
    recommendations, 
    getRecommendationsForPerson, 
    selectedPeople,
    isLoading,
    error,
    compareSelectedPeople,
    canCompare
  } = useComparison();

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isComparing, setIsComparing] = useState(false);

  const handleGetRecommendations = async (person) => {
    setSelectedPerson(person);
    await getRecommendationsForPerson(person, {
      limit: 20, // Increased from 12 to 20
      minSimilarityScore: 0.1 // Lowered from 0.2 to 0.1 for more results
    });
  };

  const displayedRecommendations = recommendations.recommendations || [];

  if (selectedPeople.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
          >
            <Sparkles className="text-white" size={32} />
          </motion.div>
          
          <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--torre-text-primary)' }}>
            No People Selected
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Select people from search results to get recommendations
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-1 shadow-lg">
              <button
                onClick={() => {
                  // This would typically trigger a navigation to search
                  if (onSwitchToCompare) onSwitchToCompare();
                }}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-white w-full bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <Search size={20} />
                Start Searching
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl shadow-2xl mx-4 sm:mx-0 overflow-hidden">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3 text-white">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Sparkles size={28} />
              </div>
              Professional Recommendations
            </h2>
            <p className="mt-2 text-indigo-100 text-lg">
              Discover similar professionals based on skills and experience
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {selectedPeople.length >= 2 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={async () => {
                  setIsComparing(true);
                  await compareSelectedPeople();
                  if (onSwitchToCompare) {
                    onSwitchToCompare();
                  }
                  setIsComparing(false);
                }}
                disabled={!canCompare || isLoading || isComparing}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl font-bold text-base transition-all ${
                  !canCompare || isLoading || isComparing ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                } bg-white text-indigo-600 shadow-lg dark:bg-gray-700 dark:text-white`}
              >
                {isComparing ? (
                  <>
                    <RefreshCw size={20} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <GitCompare size={20} />
                    Compare Profiles ({selectedPeople.length})
                  </>
                )}
              </motion.button>
            ) : selectedPeople.length === 1 ? (
              <div className="px-5 py-3 rounded-2xl bg-white/20 text-white backdrop-blur-sm">
                <span className="font-medium">Add more people to compare ({selectedPeople.length}/4)</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Person Selection */}
      <div className="p-8 bg-white dark:bg-gray-800">
        <div className="mb-8">
          <h3 className="font-bold text-2xl mb-6" style={{ color: 'var(--torre-text-primary)' }}>
            Get recommendations for:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {selectedPeople.map((person) => (
              <motion.button
                key={person.username}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleGetRecommendations(person)}
                disabled={isLoading}
                className={`flex items-center gap-4 p-5 rounded-2xl border transition-all text-left shadow-lg ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
                }`}
                style={{
                  backgroundColor: selectedPerson?.username === person.username 
                    ? 'rgb(239 246 255)' 
                    : 'white',
                  borderColor: selectedPerson?.username === person.username
                    ? 'rgb(99 102 241)'
                    : 'rgb(229 231 235)',
                }}
              >
                <Avatar
                  src={person.picture}
                  name={person.name}
                  size="w-14 h-14"
                />
                <div className="flex-1 min-w-0">
                  <h4 
                    className={`font-bold text-lg truncate`}
                    style={{ color: 'var(--torre-text-primary)' }}
                  >
                    {person.name}
                  </h4>
                  <p 
                    className={`text-base truncate text-gray-600 dark:text-gray-400`}
                  >
                    @{person.username}
                  </p>
                  {person.verified && (
                    <div className="flex items-center gap-1 mt-2">
                      <CheckCircle className="text-green-500" size={16} />
                      <span className="text-xs text-green-600 dark:text-green-400">Verified</span>
                    </div>
                  )}
                </div>
                {isLoading && selectedPerson?.username === person.username && (
                  <RefreshCw className="text-indigo-600 animate-spin" size={20} />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
        {isLoading && (
          <div className="text-center py-16">
            <div className="w-20 h-20 border-4 border-t-transparent rounded-2xl animate-spin mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600" />
            <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--torre-text-primary)' }}>
              Finding Recommendations
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Analyzing professional networks and skills...
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-16 bg-white rounded-3xl p-10 shadow-xl dark:bg-gray-800">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-100 flex items-center justify-center dark:bg-red-900/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--torre-text-primary)' }}>
              Error
            </h3>
            <p className="text-red-600 mb-8 max-w-md mx-auto dark:text-red-400">
              {error}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg"
            >
              Try Again
            </motion.button>
          </div>
        )}

        {!isLoading && !error && !recommendations.recommendations && selectedPeople.length > 0 && (
          <div className="text-center py-16 bg-white rounded-3xl p-10 shadow-xl dark:bg-gray-800">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
            >
              <Sparkles className="text-white" size={32} />
            </motion.div>
            
            <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--torre-text-primary)' }}>
              Ready for Recommendations
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto dark:text-gray-400">
              Select a person above to get personalized recommendations
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-1 shadow-lg">
                <button
                  onClick={() => {
                    if (selectedPeople.length > 0) {
                      handleGetRecommendations(selectedPeople[0]);
                    }
                  }}
                  className="px-6 py-3 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-gray-50 transition-all dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  Get Recommendations for {selectedPeople[0]?.name || 'First Person'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {!isLoading && !error && recommendations.recommendations && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Summary */}
              <div className="rounded-3xl p-7 bg-white shadow-xl dark:bg-gray-800">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <Target className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl" style={{ color: 'var(--torre-text-primary)' }}>
                        Recommendations for {recommendations.targetPerson?.name || selectedPerson?.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Based on skills, experience, and professional background
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-3 bg-indigo-50 rounded-2xl px-5 py-3 dark:bg-indigo-900/30">
                      <Users size={20} className="text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <div className="font-bold text-lg text-indigo-700 dark:text-indigo-300">
                          {recommendations.recommendations.length}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">professionals</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-green-50 rounded-2xl px-5 py-3 dark:bg-green-900/30">
                      <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
                      <div>
                        <div className="font-bold text-lg text-green-700 dark:text-green-300">
                          {Math.round(
                            recommendations.recommendations.reduce((sum, rec) => sum + rec.similarity.overallScore, 0) / 
                            recommendations.recommendations.length * 100
                          )}%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">avg match</div>
                      </div>
                    </div>
                  </div>
                </div>

                {recommendations.searchQueries && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Search queries used:</span> {recommendations.searchQueries.join(', ')}
                    </p>
                  </div>
                )}
              </div>

              {/* Recommendations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
                {displayedRecommendations.map((recommendation, index) => (
                  <RecommendationCard
                    key={recommendation.person.username}
                    recommendation={recommendation}
                    index={index}
                    onViewGenome={onViewGenome}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

      </div>
    </div>
  );
};

// Individual Recommendation Card
const RecommendationCard = ({ recommendation, index, onViewGenome }) => {
  const { person, similarity, reasons } = recommendation;
  const scoreColor = similarity.overallScore > 0.7 ? 'text-green-500' :
                    similarity.overallScore > 0.5 ? 'text-yellow-500' : 'text-blue-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800"
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Avatar
              src={person.picture}
              name={person.name}
              size="w-16 h-16"
              className="border-2 border-white rounded-full"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold truncate text-white text-xl">{person.name}</h4>
              <p className="text-indigo-100 truncate">@{person.username}</p>
              {person.verified && (
                <div className="flex items-center gap-1 mt-2">
                  <CheckCircle className="text-white" size={16} />
                  <span className="text-xs text-white">Verified</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-right flex-shrink-0 bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
            <div className={`text-3xl font-bold ${scoreColor}`}>
              {Math.round(similarity.overallScore * 100)}%
            </div>
            <div className="flex items-center gap-1">
              <Star className="text-yellow-300 fill-yellow-300" size={14} />
              <span className="text-xs text-white">match</span>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Headline */}
      <div className="p-6">
        <p className="text-gray-700 mb-5 line-clamp-2 text-lg dark:text-gray-300">
          {person.professionalHeadline || 'Professional'}
        </p>

        {/* Similarity Breakdown */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-4 text-center dark:from-indigo-900/30 dark:to-indigo-800/30">
            <div className="font-bold text-2xl text-indigo-700 dark:text-indigo-300">
              {Math.round(similarity.skillsScore * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Skills</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center dark:from-purple-900/30 dark:to-purple-800/30">
            <div className="font-bold text-2xl text-purple-700 dark:text-purple-300">
              {Math.round(similarity.strengthsScore * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Strengths</div>
          </div>
        </div>

        {/* Reasons */}
        <div className="space-y-3 mb-7">
          <h4 className="font-bold text-lg" style={{ color: 'var(--torre-text-primary)' }}>
            Why Recommended:
          </h4>
          {reasons.slice(0, 2).map((reason, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0"></div>
              <span className="text-gray-700 dark:text-gray-300">{reason}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <ComparisonButton person={person} size="md" />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="font-bold hover:opacity-80 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-2xl transition-all shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              if (onViewGenome) {
                onViewGenome(person);
              }
            }}
          >
            View Profile
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendationsView;