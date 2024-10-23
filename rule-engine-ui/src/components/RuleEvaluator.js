import React, { useState, useEffect } from "react"
import axios from "axios"

export default function RuleEvaluator() {
  const [rules, setRules] = useState([])
  const [selectedRuleId, setSelectedRuleId] = useState("")
  const [data, setData] = useState({})
  const [result, setResult] = useState(null)
  const [attributes, setAttributes] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRules()
  }, [])

  useEffect(() => {
    if (selectedRuleId) {
      const selectedRule = rules.find(
        (rule) => rule.id === parseInt(selectedRuleId)
      )
      if (selectedRule) {
        const attrs = extractAttributesFromAst(selectedRule.ast)
        setAttributes(attrs)
        setData({})
      }
    } else {
      setAttributes([])
      setData({})
    }
  }, [selectedRuleId, rules])

  const fetchRules = async () => {
    try {
      const response = await axios.get("http://localhost:5001/rules")
      setRules(response.data.rules)
    } catch (error) {
      console.error("Error fetching rules:", error)
      setError(`Error: ${error.response?.data?.error || error.message}`)
    }
  }

  const extractAttributesFromAst = (ast) => {
    const attributesSet = new Set()

    const traverse = (node) => {
      if (!node) return
      if (node.type === "operand" && node.attribute) {
        attributesSet.add(node.attribute)
      }
      traverse(node.left)
      traverse(node.right)
    }

    traverse(ast)
    return Array.from(attributesSet)
  }

  const evaluateRule = async () => {
    const missingAttributes = attributes.filter(
      (attr) => data[attr] === undefined || data[attr] === ""
    )
    if (missingAttributes.length > 0) {
      setError(`Please provide values for: ${missingAttributes.join(", ")}`)
      return
    }

    try {
      const response = await axios.post("http://localhost:5001/evaluate_rule", {
        rule_id: selectedRuleId,
        data,
      })
      setResult(response.data.result)
      setError(null)
    } catch (error) {
      console.error("Error evaluating rule:", error)
      setResult(null)
      setError(error.response?.data?.error || error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Evaluate Rule</h2>
          <div className="mb-6">
            <label htmlFor="rule-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select Rule
            </label>
            <select
              id="rule-select"
              value={selectedRuleId}
              onChange={(e) => setSelectedRuleId(e.target.value)}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Rule</option>
              {rules.map((rule) => (
                <option key={rule.id} value={rule.id}>
                  {`ID: ${rule.id}, ${rule.rule_string}${
                    rule.is_combined ? " (Combined)" : ""
                  }`}
                </option>
              ))}
            </select>
          </div>
          {attributes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Enter Data:</h3>
              <div className="space-y-4">
                {attributes.map((attr) => (
                  <div key={attr}>
                    <label htmlFor={attr} className="block text-sm font-medium text-gray-700 mb-1">
                      {attr}:
                    </label>
                    <input
                      type="text"
                      id={attr}
                      value={data[attr] || ""}
                      onChange={(e) => {
                        const value = e.target.value
                        setData({
                          ...data,
                          [attr]: isNaN(value) ? value : parseFloat(value),
                        })
                      }}
                      className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={evaluateRule}
            disabled={!selectedRuleId}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Evaluate
          </button>
          {result !== null && (
            <div className="mt-6 p-4 bg-green-100 rounded-md">
              <h3 className="text-lg font-medium text-green-800">
                Result: {result.toString()}
              </h3>
            </div>
          )}
          {error && (
            <div className="mt-6 p-4 bg-red-100 rounded-md">
              <h3 className="text-lg font-medium text-red-800">Error: {error}</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}