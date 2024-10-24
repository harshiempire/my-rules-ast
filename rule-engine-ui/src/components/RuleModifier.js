// rule-engine-ui/src/components/RuleModifier.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RuleTree from './RuleTree';

export default function RuleModifier() {
  const [rules, setRules] = useState([]);
  const [selectedRuleId, setSelectedRuleId] = useState(null);
  const [modificationType, setModificationType] = useState('modify_operand');
  const [modificationData, setModificationData] = useState({});
  const [rule, setRule] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await axios.get('http://localhost:5001/rules');
      setRules(response.data.rules);
    } catch (error) {
      console.error('Error fetching rules:', error);
      setError('Error fetching rules. Please try again later.');
    }
  };

  const handleRuleSelection = async (ruleId) => {
    setSelectedRuleId(ruleId);
    setError(null);
    setMessage(null);

    try {
      const response = await axios.get(`http://localhost:5001/rules/${ruleId}`);
      setRule(response.data.rule);
    } catch (error) {
      console.error('Error fetching rule:', error);
      setError('Error fetching rule. Please try again later.');
    }
  };

  const handleModification = (e) => {
    setModificationData({
      ...modificationData,
      [e.target.name]: e.target.value,
    });
  };

  const modifyRule = async () => {
    if (!selectedRuleId) {
      setError('Please select a rule to modify.');
      return;
    }

    setError(null);
    setMessage(null);

    try {
      const response = await axios.put(`http://localhost:5001/modify_rule/${selectedRuleId}`, {
        modification_type: modificationType,
        modification_data: modificationData,
      });
      setMessage(response.data.message);
      setRule({
        ...rule,
        rule_string: response.data.rule_string,
        ast: response.data.ast,
      });
    } catch (error) {
      console.error('Error modifying rule:', error);
      setError(
        `Error modifying rule: ${error.response?.data?.error || error.message}`
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Modify Rule</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {message && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}

      <h3 className="text-lg font-medium mb-2">Select a Rule to Modify:</h3>
      <ul className="space-y-2 mb-4 max-h-64 overflow-y-auto">
        {rules.map((ruleItem) => (
          <li key={ruleItem.id} className="flex items-center">
            <input
              type="radio"
              name="selectedRule"
              checked={selectedRuleId === ruleItem.id}
              onChange={() => handleRuleSelection(ruleItem.id)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">
              {ruleItem.rule_string}
            </span>
          </li>
        ))}
      </ul>

      {rule && (
        <>
          <h3 className="text-lg font-medium mb-2">Current Rule:</h3>
          <p className="text-sm text-gray-700 mb-4">{rule.rule_string}</p>
          <RuleTree ast={rule.ast} />

          <h3 className="text-lg font-medium mt-6 mb-2">Modify Rule:</h3>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Modification Type:
          </label>
          <select
            value={modificationType}
            onChange={(e) => setModificationType(e.target.value)}
            className="mb-4 mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="modify_operand">Modify Operand</option>
            <option value="replace_operator">Replace Operator</option>
            <option value="add_subexpression">Add Sub-expression</option>
            <option value="remove_subexpression">Remove Sub-expression</option>
          </select>

          {modificationType === 'modify_operand' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attribute:
                </label>
                <input
                  type="text"
                  name="attribute"
                  onChange={handleModification}
                  className="mt-1 block w-full border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Operator:
                </label>
                <input
                  type="text"
                  name="new_operator"
                  onChange={handleModification}
                  className="mt-1 block w-full border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Constant:
                </label>
                <input
                  type="text"
                  name="new_constant"
                  onChange={handleModification}
                  className="mt-1 block w-full border-gray-300 rounded-md"
                />
              </div>
            </>
          )}

          {modificationType === 'replace_operator' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Operator:
                </label>
                <input
                  type="text"
                  name="target_operator"
                  onChange={handleModification}
                  className="mt-1 block w-full border-gray-300 rounded-md"
                  placeholder="e.g., AND"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Operator:
                </label>
                <input
                  type="text"
                  name="new_operator"
                  onChange={handleModification}
                  className="mt-1 block w-full border-gray-300 rounded-md"
                  placeholder="e.g., OR"
                />
              </div>
            </>
          )}

          {modificationType === 'add_subexpression' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Sub-expression:
                </label>
                <input
                  type="text"
                  name="new_subexpression"
                  onChange={handleModification}
                  className="mt-1 block w-full border-gray-300 rounded-md"
                  placeholder="e.g., salary > 60000"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Operator to Combine:
                </label>
                <select
                  name="operator"
                  onChange={handleModification}
                  className="mt-1 block w-full border-gray-300 rounded-md"
                >
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </select>
              </div>
            </>
          )}

          {modificationType === 'remove_subexpression' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Sub-expression:
              </label>
              <input
                type="text"
                name="target_subexpression"
                onChange={handleModification}
                className="mt-1 block w-full border-gray-300 rounded-md"
                placeholder="e.g., department = 'Sales'"
              />
            </div>
          )}

          <button
            onClick={modifyRule}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Apply Modification
          </button>
        </>
      )}
    </div>
  );
}
