import React, { useState, useEffect } from "react";
import axios from "axios";

export default function RuleEvaluator() {
  const [rules, setRules] = useState([]);
  const [selectedRuleId, setSelectedRuleId] = useState("");
  const [data, setData] = useState({});
  const [result, setResult] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRules();
  }, []);

  useEffect(() => {
    if (selectedRuleId) {
      const selectedRule = rules.find(
        (rule) => rule.id === parseInt(selectedRuleId)
      );
      if (selectedRule) {
        const attrs = extractAttributesFromAst(selectedRule.ast);
        setAttributes(attrs);
        setData({});
      }
    } else {
      setAttributes([]);
      setData({});
    }
  }, [selectedRuleId, rules]);

  const fetchRules = async () => {
    try {
      const response = await axios.get("http://localhost:5001/rules");
      setRules(response.data.rules);
    } catch (error) {
      console.error("Error fetching rules:", error);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const extractAttributesFromAst = (ast) => {
    const attributesSet = new Set();

    const traverse = (node) => {
      if (!node) return;
      if (node.type === "operand" && node.attribute) {
        attributesSet.add(node.attribute);
      }
      traverse(node.left);
      traverse(node.right);
    };

    traverse(ast);
    return Array.from(attributesSet);
  };

  const evaluateRule = async () => {
    const missingAttributes = attributes.filter(
      (attr) => data[attr] === undefined || data[attr] === ""
    );
    if (missingAttributes.length > 0) {
      setError(`Please provide values for: ${missingAttributes.join(", ")}`);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/evaluate_rule", {
        rule_id: selectedRuleId,
        data,
      });
      setResult(response.data.result);
      setError(null);
    } catch (error) {
      console.error("Error evaluating rule:", error);
      setResult(null);
      setError(error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Evaluate Rule</h2>
      <div className="mb-4">
        <select
          value={selectedRuleId}
          onChange={(e) => setSelectedRuleId(e.target.value)}
          className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Enter Data:</h3>
          {attributes.map((attr) => (
            <div key={attr} className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {attr}:
              </label>
              <input
                type="text"
                value={data[attr] || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setData({
                    ...data,
                    [attr]: isNaN(value) ? value : parseFloat(value),
                  });
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          ))}
        </div>
      )}
      <button
        onClick={evaluateRule}
        disabled={!selectedRuleId}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Evaluate
      </button>
      {result !== null && (
        <div className="mt-4 p-4 bg-green-100 rounded-md">
          <h3 className="text-lg font-medium text-green-800">
            Result: {result.toString()}
          </h3>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 rounded-md">
          <h3 className="text-lg font-medium text-red-800">Error: {error}</h3>
        </div>
      )}
    </div>
  );
}
