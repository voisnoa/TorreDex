import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MapPin, 
  Calendar, 
  Star, 
  Users, 
  Eye, 
  CheckCircle, 
  Globe, 
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  Heart
} from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { formatDateRange } from '../utils/dataProcessing';

/**
 * UserProfileModal component for displaying detailed user information
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Object} props.user - User data to display
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 */
const UserProfileModal = ({ isOpen, onClose, user, loading, error }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Profile Details
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                aria-label="Close modal"
              >
                <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              {loading && (
                <div className="p-12">
                  <LoadingSpinner size="lg" text="Loading profile details..." />
                </div>
              )}

              {error && (
                <div className="p-6">
                  <div className="text-center text-red-600 dark:text-red-400">
                    <p className="text-lg font-medium mb-2">Failed to load profile</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}

              {user && !loading && !error && (
                <div className="p-6 md:p-8 space-y-8">
                  {/* User Header */}
                  <div className="flex flex-col md:flex-row items-start md:space-x-8">
                    <div className="flex-shrink-0 mb-6 md:mb-0">
                      {user.picture ? (
                        <img
                          src={user.picture}
                          alt={`${user.name}'s avatar`}
                          className="w-32 h-32 rounded-2xl object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                          {user.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                          {user.name || 'Unknown User'}
                        </h1>
                        {user.verified && (
                          <CheckCircle className="h-7 w-7 text-blue-500" />
                        )}
                      </div>

                      {user.headline && (
                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-5">
                          {user.headline}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600 dark:text-gray-400">
                        {user.username && (
                          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full font-medium">
                            @{user.username}
                          </span>
                        )}
                        
                        {user.location?.name && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{user.location.name}</span>
                          </div>
                        )}

                        {user.remote && (
                          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <Globe className="h-4 w-4" />
                            <span>Remote</span>
                          </div>
                        )}

                        {user.openToWork && (
                          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <Briefcase className="h-4 w-4" />
                            <span>Open to work</span>
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      {(user.stats?.connections > 0 || user.stats?.views > 0 || user.stats?.recommendations > 0) && (
                        <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                          {user.stats.connections > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 dark:text-white">{user.stats.connections}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">connections</div>
                              </div>
                            </div>
                          )}
                          
                          {user.stats.views > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 dark:text-white">{user.stats.views}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">views</div>
                              </div>
                            </div>
                          )}
                          
                          {user.stats.recommendations > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 dark:text-white">{user.stats.recommendations}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">recommendations</div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Skills Section */}
                  {user.skills && user.skills.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        Skills
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {user.skills.slice(0, 12).map((skill, index) => (
                          <div
                            key={skill.id || index}
                            className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {skill.name}
                              </span>
                            </div>
                            {skill.weight > 0 && (
                              <div className="flex items-center gap-1">
                                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                  <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                                    {skill.weight}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {user.skills.length > 12 && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                          +{user.skills.length - 12} more skills
                        </p>
                      )}
                    </div>
                  )}

                  {/* Strengths Section */}
                  {user.strengths && user.strengths.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        Strengths
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {user.strengths.slice(0, 8).map((strength, index) => (
                          <div
                            key={strength.id || index}
                            className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-800/30"
                          >
                            <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                            <span className="font-bold text-sm">
                              {strength.name}
                            </span>
                            {strength.weight > 0 && (
                              <span className="ml-2 text-purple-600 dark:text-purple-300 font-bold">
                                ({strength.weight})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interests Section */}
                  {user.interests && user.interests.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                          <Heart className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                        </div>
                        Interests
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {user.interests.slice(0, 12).map((interest, index) => (
                          <div
                            key={interest.id || index}
                            className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 text-pink-800 dark:text-pink-200 border border-pink-200 dark:border-pink-800/30"
                          >
                            <div className="w-2 h-2 rounded-full bg-pink-500 mr-2"></div>
                            <span className="font-bold text-sm">
                              {interest.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience Section */}
                  {user.experiences && user.experiences.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        Experience
                      </h3>
                      <div className="space-y-4">
                        {user.experiences.slice(0, 5).map((exp, index) => (
                          <div
                            key={exp.id || index}
                            className="p-5 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                                  {exp.name}
                                </h4>
                                {exp.category && (
                                  <p className="text-base text-gray-700 dark:text-gray-300 mt-1">
                                    {exp.category}
                                  </p>
                                )}
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                  {formatDateRange(exp.fromMonth, exp.fromYear, exp.toMonth, exp.toYear)}
                                </p>
                              </div>
                              {exp.highlighted && (
                                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                  <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education Section */}
                  {user.education && user.education.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <GraduationCap className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        Education
                      </h3>
                      <div className="space-y-4">
                        {user.education.slice(0, 3).map((edu, index) => (
                          <div
                            key={edu.id || index}
                            className="p-5 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                                  {edu.name}
                                </h4>
                                {edu.category && (
                                  <p className="text-base text-gray-700 dark:text-gray-300 mt-1">
                                    {edu.category}
                                  </p>
                                )}
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                  {formatDateRange(edu.fromMonth, edu.fromYear, edu.toMonth, edu.toYear)}
                                </p>
                              </div>
                              {edu.highlighted && (
                                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                  <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages Section */}
                  {user.languages && user.languages.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                          <Languages className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        Languages
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {user.languages.map((lang, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
                          >
                            <span className="font-medium text-gray-900 dark:text-white">
                              {lang.language}
                            </span>
                            <span className="text-sm font-medium bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 px-3 py-1 rounded-full">
                              {lang.fluency}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserProfileModal;