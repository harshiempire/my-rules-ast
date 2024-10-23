import React, { useState, useEffect } from "react";
import axios from "axios";
import RuleTree from "./RuleTree";

export default function RuleCombiner() {
  const [rules, setRules] = useState([]);
  const [selectedRuleIds, setSelectedRuleIds] = useState([]);
  const [combinedRule, setCombinedRule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await axios.get("http://localhost:5001/rules");
      setRules(response.data.rules);
    } catch (error) {
      console.error("Error fetching rules:", error);
      setError("Error fetching rules. Please try again later.");
    }
  };

  const handleRuleSelection = (ruleId) => {
    setSelectedRuleIds((prev) =>
      prev.includes(ruleId)
        ? prev.filter((id) => id !== ruleId)
        : [...prev, ruleId]
    );
  };

  const combineRules = async () => {
    if (selectedRuleIds.length < 2) {
      alert("Please select at least two rules to combine.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:5001/combine_rules", {
        rule_ids: selectedRuleIds,
      });
      const combinedRuleId = response.data.rule_id;

      // Fetch the combined rule
      const ruleResponse = await axios.get(
        `http://localhost:5001/rules/${combinedRuleId}`
      );
      setCombinedRule(ruleResponse.data.rule);

      // Clear selected rules
      setSelectedRuleIds([]);
    } catch (error) {
      console.error("Error combining rules:", error);
      setError(
        `Error combining rules: ${error.response?.data?.error || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md m-5">
      <h2 className="text-2xl font-bold mb-4">Rule Combiner</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <h3 className="text-lg font-medium mb-2">Select Rules to Combine:</h3>
      <ul className="space-y-2 mb-4 max-h-64 overflow-y-auto">
        {rules.map((rule) => (
          <li key={rule.id} className="flex items-center">
            <input
              type="checkbox"
              checked={selectedRuleIds.includes(rule.id)}
              onChange={() => handleRuleSelection(rule.id)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              {rule.rule_string}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={combineRules}
        disabled={loading || selectedRuleIds.length < 2}
        className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
          loading || selectedRuleIds.length < 2
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        {loading ? "Combining..." : "Combine Selected Rules"}
      </button>

      {combinedRule && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Combined Rule</h3>
          <p className="text-sm text-gray-700 mb-4">
            {combinedRule.rule_string}
          </p>
          <RuleTree ast={combinedRule.ast} />
        </div>
      )}
    </div>
  );
}
