
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import RuleTree from './RuleTree'

export default function RuleList() {
  const [rules, setRules] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await axios.get('http://localhost:5001/rules')
      setRules(response.data.rules)
    } catch (error) {
      console.error('Error fetching rules:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={fetchRules}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Rule List</h2>
        {rules.length === 0 ? (
          <p className="text-gray-600 text-center">No rules found.</p>
        ) : (
          <div className="space-y-6">
            {rules.map((rule) => (
              <div key={rule.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">ID: {rule.id}</h3>
                  <p className="text-sm text-gray-500 mb-4">Rule String: {rule.rule_string}</p>
                  <div className="mt-4 bg-gray-50 p-4 rounded-md">
                    <RuleTree ast={rule.ast} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}