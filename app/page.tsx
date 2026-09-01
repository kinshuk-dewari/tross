"use client";

import { useState } from "react";

import {
  IconAlertCircle,
  IconCheck,
  IconClipboard,
  IconLoader2,
  IconSearch,
  IconSparkles,
} from "@tabler/icons-react";

import InputBox from "../components/InputBox";
import Profile from "../components/Profile";

import type { LinkedInProfile } from "@/lib/linkedin/types";

export default function Home() {
  const [profile, setProfile] = useState("");
  const [liAt, setLiAt] = useState("");
  const [jsessionId, setJsessionId] = useState("");

  const [result, setResult] = useState<LinkedInProfile | null>(null);

  const [meta, setMeta] = useState<{
    source?: string;
    publicIdentifier?: string;
  }>({});

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const search = async () => {
    setError("");
    setResult(null);

    if (!liAt.trim()) {
      setError("Please enter your LinkedIn li_at value");
      return;
    }

    if (!jsessionId.trim()) {
      setError("Please enter your LinkedIn JSESSIONID value");
      return;
    }

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
          li_at: liAt.trim(),
          JSESSIONID: jsessionId.trim(),
        },
        body: JSON.stringify({
          url: profile.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error?.message ||
            data?.error ||
            "Failed to fetch LinkedIn profile"
        );
      }

      setResult(data.profile);
      setMeta(data.meta || {});
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(
        JSON.stringify(
          {
            profile: result,
            meta,
          },
          null,
          2
        )
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Failed to copy result");
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 -top-75 h-125 w-175 -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Hero */}
        <section className="mx-auto mb-14 max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-xs font-medium text-gray-600">
            <IconSparkles size={14} stroke={1.8} />
            <span>Tross Linkedin Scraper : Kinshuk Dewari</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-gray-950 sm:text-5xl lg:text-6xl">
            Extract profile data
            <br />
            <span className="text-blue-600">Linkedin</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
            Enter your LinkedIn session details and profile URL to retrieve
            structured professional information in seconds
          </p>
        </section>

        {/* Search */}
        <section className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.06)] sm:p-6">
            {/* LinkedIn credentials */}
            <div className="mb-4">
              <InputBox
                label="LinkedIn li_at"
                type="password"
                placeholder="Paste your li_at value"
                value={liAt}
                onChange={(e) => setLiAt(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <InputBox
                label="LinkedIn JSESSIONID"
                type="password"
                placeholder="Paste your JSESSIONID value"
                value={jsessionId}
                onChange={(e) => setJsessionId(e.target.value)}
              />
            </div>

            {/* Profile URL */}
            <div className="mb-4">
              <InputBox
                label="LinkedIn profile"
                type="text"
                placeholder="https://www.linkedin.com/in/example/"
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
              />
            </div>

            {/* Search button */}
            <button
              type="button"
              onClick={search}
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition-all duration-200 hover:bg-blue-700 hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] active:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-600/50"
            >
              {loading ? (
                <>
                  <IconLoader2 size={18} className="animate-spin" />
                  <span>Fetching profile...</span>
                </>
              ) : (
                <>
                  <IconSearch size={18} />
                  <span>Search profile</span>
                </>
              )}
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-gray-400">
            Profile data will be displayed below
          </p>
        </section>

        {/* Error */}
        {error && (
          <div className="mx-auto mt-6 max-w-3xl">
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <IconAlertCircle
                size={18}
                className="mt-0.5 shrink-0"
                stroke={1.8}
              />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-10 flex justify-center">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <IconLoader2
                size={18}
                className="animate-spin text-blue-600"
              />
              <span>Contacting LinkedIn...</span>
            </div>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <section className="mt-20">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Extraction complete
                  </span>
                </div>

                <h2 className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
                  Profile result
                </h2>

                {meta.publicIdentifier && (
                  <p className="mt-1 text-sm text-gray-500">
                    @{meta.publicIdentifier}
                  </p>
                )}
              </div>

              {/* Copy button */}
              <button
                type="button"
                onClick={copy}
                className="flex h-10 items-center justify-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 sm:self-auto"
              >
                {copied ? (
                  <>
                    <IconCheck size={17} />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <IconClipboard size={17} />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>

            {/* Profile result */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-1">
              <Profile profile={result} meta={meta} />
            </div>
          </section>
        )}
      </div>

      {/* Copy toast */}
      <div
        className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
          copied
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-950 px-4 py-3 text-white shadow-2xl">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600">
            <IconCheck size={13} stroke={2.5} />
          </div>
          <span className="text-sm font-medium">Copied to clipboard</span>
        </div>
      </div>
    </main>
  );
}