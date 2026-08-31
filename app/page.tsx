"use client";

import { useState } from "react";
import Button from "../components/Button";
import InputBox from "../components/InputBox";

export default function Home() {
  const [profile, setProfile] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setError("");
    setResult("");

    if (!profile.trim()) {
      setError("Please enter a LinkedIn profile URL");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/v1/linkedin/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: profile.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error?.message || "Failed to fetch LinkedIn profile"
        );
      }

      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
    } catch {
      setError("Failed to copy result");
    }
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">
          LinkedIn Profile API
        </h1>

        <p className="text-gray-600 mt-2">
          Enter a LinkedIn profile URL to retrieve
          structured profile information.
        </p>
      </div>

      <InputBox
        label="LinkedIn Profile"
        type="text"
        placeholder="https://www.linkedin.com/in/example/"
        value={profile}
        onChange={(e) => setProfile(e.target.value)}
      />

      <Button
        label={loading ? "Searching..." : "Search"}
        onClick={search}
      />

      {error && (
        <div className="p-3 rounded border border-red-300 bg-red-50 text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="font-bold">
              Result
            </h2>

            <Button
              label="Copy to clipboard"
              onClick={copy}
            />
          </div>

          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}