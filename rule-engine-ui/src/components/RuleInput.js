import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

export default function RuleInput() {
  const [ruleString, setRuleString] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // Loading state

  const handleEditorDidMount = (editor, monaco) => {
    monaco.languages.registerCompletionItemProvider("plaintext", {
      provideCompletionItems: () => {
        const suggestions = [
          {
            label: "age",
            kind: monaco.languages.CompletionItemKind.Field,
            insertText: "age",
          },
          {
            label: "department",
            kind: monaco.languages.CompletionItemKind.Field,
            insertText: "department",
          },
          {
            label: "salary",
            kind: monaco.languages.CompletionItemKind.Field,
            insertText: "salary",
          },
          {
            label: "experience",
            kind: monaco.languages.CompletionItemKind.Field,
            insertText: "experience",
          },
          {
            label: "AND",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "AND",
          },
          {
            label: "OR",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "OR",
          },
        ];
        return { suggestions: suggestions };
      },
    });
  };

  const validateRuleSyntax = async (ruleString) => {
    try {
      const response = await axios.post("http://localhost:5001/validate_rule", {
        rule_string: ruleString,
      });
      return response.data.valid;
    } catch (error) {
      setError(error.response?.data?.error || "Invalid rule syntax.");
      return false;
    }
  };

  const saveRule = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!ruleString.trim()) {
      setError("Rule cannot be empty.");
      return;
    }

    setIsSaving(true); // Start loading

    const isValid = await validateRuleSyntax(ruleString);
    if (!isValid) {
      setIsSaving(false); // End loading if validation fails
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/create_rule", {
        rule_string: ruleString,
      });
      setSuccessMessage(`Rule saved with ID: ${response.data.rule_id}`);
      setRuleString(""); // Clear the editor after saving
    } catch (error) {
      console.error("Error saving rule:", error);
      setError(error.response?.data?.error || error.message);
    } finally {
      setIsSaving(false); // End loading
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md m-5">
      <h2 className="text-2xl font-bold mb-4">Enter Rule</h2>
      <p className="mb-2">
        Example:{" "}
        <code className="bg-gray-100 p-1 rounded">
          age {">"} 30 AND department = 'Sales'
        </code>
      </p>
      <p className="mb-2">
        Available Fields:{" "}
        <code className="bg-gray-100 p-1 rounded">age</code>,{" "}
        <code className="bg-gray-100 p-1 rounded">department</code>,{" "}
        <code className="bg-gray-100 p-1 rounded">salary</code>,{" "}
        <code className="bg-gray-100 p-1 rounded">experience</code>, etc.
      </p>
      <p className="mb-4">
        Available Operators:{" "}
        <code className="bg-gray-100 p-1 rounded">=</code>,{" "}
        <code className="bg-gray-100 p-1 rounded">!=</code>,{" "}
        <code className="bg-gray-100 p-1 rounded">&gt;</code>,{" "}
        <code className="bg-gray-100 p-1 rounded">&lt;</code>,{" "}
        <code className="bg-gray-100 p-1 rounded">&gt;=</code>,{" "}
        <code className="bg-gray-100 p-1 rounded">&lt;=</code>,{" "}
        <code className="bg-gray-100 p-1 rounded">AND</code>,{" "}
        <code className="bg-gray-100 p-1 rounded">OR</code>
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      <Editor
        height="200px"
        defaultLanguage="plaintext"
        value={ruleString}
        onChange={(value) => setRuleString(value)}
        options={{
          minimap: { enabled: false },
          lineNumbers: "off",
          suggestOnTriggerCharacters: true,
        }}
        onMount={handleEditorDidMount}
        className="border border-gray-300 rounded-md mb-4"
      />

      <button
        onClick={saveRule}
        disabled={!ruleString.trim() || isSaving}
        className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
          isSaving ? "cursor-wait" : ""
        }`}
      >
        {isSaving ? "Saving..." : "Save Rule"}
      </button>
    </div>
  );
}