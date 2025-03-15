"use client";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setOutput(null); // Clear previous output when submitting new query
    
    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "An unknown error occurred");
      }

      if (!data.output) {
        throw new Error("No response received from the AI service");
      }

      setOutput(data.output);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 pt-32">
      <h1 className="text-2xl font-bold mb-4">Financial Information Assistant</h1>
      <p className="mb-4 text-gray-600">
        Ask questions about financial concepts, terms, or general information.
      </p>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: retirement planning, index funds, budgeting tips"
            required
            className="border p-2 w-full md:max-w-md rounded"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:bg-green-400"
          >
            {isLoading ? "Generating..." : "Get Financial Information"}
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="mt-4 flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-700 mr-2"></div>
          Processing your request...
        </div>
      )}
      
      {error && (
        <div className="mt-4 text-red-500 border border-red-300 p-4 rounded">
          Error: {error}
        </div>
      )}

      {output && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Financial Information:</h2>
          <div className="border p-4 mt-2 whitespace-pre-wrap bg-gray-50 rounded">{output}</div>
          <p className="mt-2 text-sm text-gray-500">
            Disclaimer: This information is for educational purposes only and not intended as
            specific financial advice. Please consult with a qualified financial professional
            for personalized guidance.
          </p>
        </div>
      )}
    </div>
  );
}