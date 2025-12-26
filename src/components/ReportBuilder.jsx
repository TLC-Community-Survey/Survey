import React, { useState, useEffect } from 'react'
import { getAvailableFields, generateReport } from '../services/dashboard'

const REPORT_TEMPLATES = [
  {
    id: 'performance-vs-stability',
    name: 'Performance vs Stability',
    description: 'Compare FPS performance against client stability ratings',
    field1: 'avg_fps_post_cu1',
    field2: 'overall_client_stability',
  },
  {
    id: 'hardware-performance',
    name: 'Hardware vs Performance',
    description: 'See how different GPUs affect FPS performance',
    field1: 'gpu',
    field2: 'avg_fps_post_cu1',
  },
  {
    id: 'quest-ratings',
    name: 'Quest Ratings Comparison',
    description: 'Compare different quest ratings',
    field1: 'mother_rating',
    field2: 'overall_quest_story_rating',
  },
  {
    id: 'age-performance',
    name: 'Age vs Performance',
    description: 'Compare age groups with performance metrics',
    field1: 'age',
    field2: 'avg_fps_post_cu1',
  },
  {
    id: 'playtime-satisfaction',
    name: 'Playtime vs Satisfaction',
    description: 'See if playtime correlates with overall satisfaction',
    field1: 'playtime',
    field2: 'overall_score_post_cu1',
  },
]

function ReportBuilder() {
  const [fields, setFields] = useState(null)
  const [selectedField1, setSelectedField1] = useState('')
  const [selectedField2, setSelectedField2] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadFields()
  }, [])

  useEffect(() => {
    if (selectedTemplate) {
      const template = REPORT_TEMPLATES.find(t => t.id === selectedTemplate)
      if (template) {
        setSelectedField1(template.field1)
        setSelectedField2(template.field2)
      }
    }
  }, [selectedTemplate])

  const loadFields = async () => {
    try {
      const data = await getAvailableFields()
      setFields(data)
    } catch (err) {
      console.error('Error loading fields:', err)
      setError('Failed to load available fields')
    }
  }

  const handleGenerateReport = async () => {
    if (!selectedField1 || !selectedField2) {
      setError('Please select both fields to compare')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await generateReport(selectedField1, selectedField2)
      setReportData(data)
    } catch (err) {
      console.error('Error generating report:', err)
      setError('Failed to generate report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getAllFields = () => {
    if (!fields) return []
    return [
      ...fields.performance,
      ...fields.quests,
      ...fields.hardware,
      ...fields.overall,
    ]
  }

  const getFieldLabel = (value) => {
    const allFields = getAllFields()
    const field = allFields.find(f => f.value === value)
    return field ? field.label : value
  }

  if (!fields) {
    return (
      <div className="bg-notion-surface rounded-lg p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-notion-text mx-auto mb-4"></div>
          <p className="text-notion-text-muted">Loading report builder...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-notion-surface rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-notion-text mb-6">Report Builder</h2>

      {/* Templates */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-notion-text mb-3">
          Quick Templates
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {REPORT_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`text-left p-4 rounded-lg border-2 transition-colors ${
                selectedTemplate === template.id
                  ? 'border-notion-blue bg-notion-blue/10'
                  : 'border-notion-border bg-notion-bg hover:border-notion-blue/50'
              }`}
            >
              <div className="font-medium text-notion-text mb-1">{template.name}</div>
              <div className="text-sm text-notion-text-muted">{template.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Field Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-notion-text mb-2">
            First Field (X-axis)
          </label>
          <select
            value={selectedField1}
            onChange={(e) => {
              setSelectedField1(e.target.value)
              setSelectedTemplate('')
            }}
            className="w-full px-4 py-2 bg-notion-bg border border-notion-border rounded-lg text-notion-text focus:outline-none focus:ring-2 focus:ring-notion-blue"
          >
            <option value="">Select a field...</option>
            {getAllFields().map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-notion-text mb-2">
            Second Field (Y-axis)
          </label>
          <select
            value={selectedField2}
            onChange={(e) => {
              setSelectedField2(e.target.value)
              setSelectedTemplate('')
            }}
            className="w-full px-4 py-2 bg-notion-bg border border-notion-border rounded-lg text-notion-text focus:outline-none focus:ring-2 focus:ring-notion-blue"
          >
            <option value="">Select a field...</option>
            {getAllFields().map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerateReport}
        disabled={loading || !selectedField1 || !selectedField2}
        className="w-full md:w-auto px-6 py-3 bg-notion-blue text-white rounded-lg hover:bg-notion-blue-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium mb-6"
      >
        {loading ? 'Generating Report...' : 'Generate Report'}
      </button>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Report Results */}
      {reportData && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-notion-text mb-4">
            Report: {getFieldLabel(reportData.field1)} vs {getFieldLabel(reportData.field2)}
          </h3>
          
          <div className="bg-notion-bg rounded-lg p-4 mb-4">
            <div className="text-sm text-notion-text-muted mb-2">Total Data Points</div>
            <div className="text-2xl font-bold text-notion-text">{reportData.total}</div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-notion-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-notion-text">
                    {getFieldLabel(reportData.field1)}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-notion-text">
                    {getFieldLabel(reportData.field2)}
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-notion-text">
                    Count
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-notion-text">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportData.data.map((row, index) => {
                  const field1Value = row[reportData.field1]
                  const field2Value = row[reportData.field2]
                  const count = row.count || 0
                  const percentage = reportData.total > 0 ? ((count / reportData.total) * 100).toFixed(1) : 0

                  return (
                    <tr
                      key={index}
                      className="border-b border-notion-border hover:bg-notion-surface/50"
                    >
                      <td className="py-3 px-4 text-sm text-notion-text">
                        {field1Value !== null && field1Value !== undefined ? String(field1Value) : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm text-notion-text">
                        {field2Value !== null && field2Value !== undefined ? String(field2Value) : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm text-notion-text text-right">{count}</td>
                      <td className="py-3 px-4 text-sm text-notion-text text-right">{percentage}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Visualization Placeholder */}
          <div className="mt-6 bg-notion-bg rounded-lg p-6">
            <div className="text-sm text-notion-text-muted mb-4">Data Distribution</div>
            <div className="space-y-2">
              {reportData.data.slice(0, 10).map((row, index) => {
                const count = row.count || 0
                const percentage = reportData.total > 0 ? (count / reportData.total) * 100 : 0

                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="text-xs text-notion-text-muted w-32 truncate">
                      {String(row[reportData.field1])} → {String(row[reportData.field2])}
                    </div>
                    <div className="flex-1 bg-notion-surface rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full transition-all bg-notion-blue/50"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-notion-text-muted w-16 text-right">
                      {count} ({percentage.toFixed(1)}%)
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportBuilder

