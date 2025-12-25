import React, { useState, useEffect } from 'react'
import { getOverallStats, getUserDashboard } from '../services/dashboard'
import { getAuth, isAuthenticated, clearAuth } from '../services/auth'
import ReportBuilder from './ReportBuilder'
import AuthModal from './AuthModal'
import Footer from './Footer'

function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState(null)
  const [showReportBuilder, setShowReportBuilder] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const auth = isAuthenticated()
  const userDiscordName = getAuth()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (auth && userDiscordName) {
        const data = await getUserDashboard(userDiscordName)
        setStats(data.overall)
        setUserData(data.user)
      } else {
        const data = await getOverallStats()
        setStats(data)
        setUserData(null)
      }
    } catch (err) {
      console.error('Error loading dashboard:', err)
      let errorMessage = 'Failed to load dashboard data. Please try again later.'
      
      // Provide more helpful error messages (sanitize to avoid showing stack traces)
      const errMsg = err.message || ''
      if (errMsg.includes('Failed to fetch') || errMsg.includes('NetworkError')) {
        errorMessage = 'Unable to connect to the dashboard API. Make sure you are running the app with `npm run dev:full` for local development.'
      } else if (errMsg.includes('Expected JSON')) {
        errorMessage = 'The dashboard API returned an unexpected response. Make sure you are running with `npm run dev:full` to enable API endpoints.'
      } else if (errMsg && !errMsg.includes('stack') && !errMsg.includes('at ') && errMsg.length < 200) {
        // Only show clean error messages (no stack traces, reasonable length)
        errorMessage = errMsg
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-notion-text mx-auto mb-4"></div>
          <p className="text-notion-text-muted">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
            <p className="text-red-500">{error}</p>
          </div>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-notion-blue text-white rounded-lg hover:bg-notion-blue-hover transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="min-h-screen bg-notion-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-notion-text mb-2">Survey Dashboard</h1>
            <p className="text-notion-text-muted">
              {auth ? 'Your personalized dashboard with comparison data' : 'Overall survey statistics'}
            </p>
          </div>
          <div>
            {auth ? (
              <button
                onClick={() => {
                  clearAuth()
                  window.location.reload()
                }}
                className="px-4 py-2 border border-notion-border rounded-lg text-notion-text hover:bg-notion-bg transition-colors text-sm"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 bg-notion-blue text-white rounded-lg hover:bg-notion-blue-hover transition-colors text-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Basic Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Responses"
            value={stats.totalResponses}
            icon="📊"
          />
          <StatCard
            title="Avg FPS Pre CU1"
            value={stats.avgFpsPre}
            suffix=" FPS"
            icon="⚡"
          />
          <StatCard
            title="Avg FPS Post CU1"
            value={stats.avgFpsPost}
            suffix=" FPS"
            icon="🚀"
          />
          <StatCard
            title="Avg Stability"
            value={stats.avgStability}
            suffix="/5"
            icon="🛡️"
          />
        </div>

        {/* Performance Comparison */}
        <div className="bg-notion-surface rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-notion-text mb-4">Performance Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.performanceComparison.map((item) => (
              <div key={item.pre_cu1_vs_post} className="bg-notion-bg rounded-lg p-4">
                <div className="text-sm text-notion-text-muted mb-1">{item.pre_cu1_vs_post}</div>
                <div className="text-2xl font-bold text-notion-text">{item.count}</div>
                <div className="text-xs text-notion-text-muted mt-1">
                  {((item.count / stats.totalResponses) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Comparison (if authenticated) */}
        {auth && userData && (
          <div className="bg-notion-surface rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-notion-text mb-4">Your Response vs Average</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ComparisonItem
                label="FPS Pre CU1"
                userValue={userData.avg_fps_pre_cu1}
                avgValue={stats.avgFpsPre}
                unit=" FPS"
              />
              <ComparisonItem
                label="FPS Post CU1"
                userValue={userData.avg_fps_post_cu1}
                avgValue={stats.avgFpsPost}
                unit=" FPS"
              />
              <ComparisonItem
                label="Client Stability"
                userValue={userData.overall_client_stability}
                avgValue={stats.avgStability}
                unit="/5"
              />
              <ComparisonItem
                label="Overall Score"
                userValue={userData.overall_score_post_cu1}
                avgValue={stats.avgOverallScore}
                unit="/5"
              />
            </div>
          </div>
        )}

        {/* Bug Statistics */}
        <div className="bg-notion-surface rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-notion-text mb-4">Common Bugs Experienced</h2>
          <div className="space-y-2">
            {Object.entries(stats.bugStats).map(([bug, count]) => (
              <div key={bug} className="flex items-center justify-between">
                <span className="text-notion-text">{bug}</span>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-notion-bg rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-notion-blue h-full transition-all"
                      style={{ width: `${(count / stats.totalResponses) * 100}%` }}
                    />
                  </div>
                  <span className="text-notion-text font-medium w-16 text-right">
                    {count} ({((count / stats.totalResponses) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quest Ratings */}
        {Object.keys(stats.questRatings).length > 0 && (
          <div className="bg-notion-surface rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-notion-text mb-4">Quest Ratings (Average)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.questRatings).map(([quest, rating]) => (
                <div key={quest} className="bg-notion-bg rounded-lg p-4">
                  <div className="text-sm text-notion-text-muted mb-1">{quest}</div>
                  <div className="text-2xl font-bold text-notion-text">{rating}/5</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hardware Stats */}
        <div className="bg-notion-surface rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-notion-text mb-4">Hardware Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-medium text-notion-text mb-3">Top CPUs</h3>
              <div className="space-y-2">
                {stats.hardwareStats.topCpus.slice(0, 5).map((cpu) => (
                  <div key={cpu.cpu} className="flex justify-between text-sm">
                    <span className="text-notion-text">{cpu.cpu}</span>
                    <span className="text-notion-text-muted">{cpu.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-notion-text mb-3">Top GPUs</h3>
              <div className="space-y-2">
                {stats.hardwareStats.topGpus.slice(0, 5).map((gpu) => (
                  <div key={gpu.gpu} className="flex justify-between text-sm">
                    <span className="text-notion-text">{gpu.gpu}</span>
                    <span className="text-notion-text-muted">{gpu.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-notion-text mb-3">Average Playtime</h3>
              <div className="text-3xl font-bold text-notion-text">{stats.hardwareStats.avgPlaytime} hours</div>
            </div>
          </div>
        </div>

        {/* Report Builder Toggle */}
        <div className="mb-8">
          <button
            onClick={() => setShowReportBuilder(!showReportBuilder)}
            className="w-full px-6 py-4 bg-notion-blue text-white rounded-lg hover:bg-notion-blue-hover transition-colors font-medium"
          >
            {showReportBuilder ? 'Hide Report Builder' : 'Open Report Builder'}
          </button>
        </div>

        {/* Report Builder */}
        {showReportBuilder && (
          <div className="mb-8">
            <ReportBuilder userDiscordName={auth ? userDiscordName : null} />
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false)
          loadDashboardData()
        }}
      />

      <Footer />
    </div>
  )
}

function StatCard({ title, value, suffix = '', icon }) {
  return (
    <div className="bg-notion-surface rounded-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-notion-text-muted">{title}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold text-notion-text">
        {value !== null && value !== undefined ? value : 'N/A'}{suffix}
      </div>
    </div>
  )
}

function ComparisonItem({ label, userValue, avgValue, unit = '' }) {
  if (userValue === null || userValue === undefined) {
    return null
  }

  const diff = userValue - avgValue
  const diffPercent = avgValue !== 0 ? ((diff / avgValue) * 100).toFixed(1) : 0

  return (
    <div className="bg-notion-bg rounded-lg p-4">
      <div className="text-sm text-notion-text-muted mb-2">{label}</div>
      <div className="flex items-baseline gap-4">
        <div>
          <div className="text-xl font-bold text-notion-text">You: {userValue}{unit}</div>
          <div className="text-sm text-notion-text-muted">Avg: {avgValue}{unit}</div>
        </div>
        <div className={`text-lg font-semibold ${diff >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {diff >= 0 ? '+' : ''}{diff.toFixed(1)}{unit} ({diffPercent >= 0 ? '+' : ''}{diffPercent}%)
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

