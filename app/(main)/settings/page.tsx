"use client";
import { apiBase } from "@/lib/apiBase";

import React, { useCallback, useEffect, useState } from "react";
import { KeyRound, Copy, RefreshCw, ShieldAlert } from "lucide-react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

interface ApiKeyInfo {
  lastFour?: string;
  apiKeyCreatedAt?: string;
}

const MASK_PREFIX = "••••••••••••••••••••";

export default function SettingsPage() {
  const token = sessionStorage.getItem("token");
  const [existingKey, setExistingKey] = useState<ApiKeyInfo | null>(null);
  const [loadingKeyInfo, setLoadingKeyInfo] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [newKeyLastFour, setNewKeyLastFour] = useState<string | null>(null);
  const [newKeyCreatedAt, setNewKeyCreatedAt] = useState<string | null>(null);

  const fetchApiKeyInfo = useCallback(async () => {
    if (!token) return;
    setLoadingKeyInfo(true);
    try {
      const endpoint = `${apiBase()}/v1/client/api-key`;
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200 && response.data?.data) {
        const data = response.data.data;
        setExistingKey({
          lastFour: data.lastFour ?? undefined,
          apiKeyCreatedAt: data.apiKeyCreatedAt ?? undefined,
        });
      }
    } catch {
      setExistingKey(null);
    } finally {
      setLoadingKeyInfo(false);
    }
  }, [token]);

  useEffect(() => {
    fetchApiKeyInfo();
  }, [fetchApiKeyInfo]);

  const generateApiKey = async () => {
    if (!token) return;
    setGenerating(true);
    setNewKey(null);
    setNewKeyLastFour(null);
    setNewKeyCreatedAt(null);
    try {
      const endpoint = `${apiBase()}/v1/client/api-key`;
      const response = await axios.post(
        endpoint,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201 && response.data?.data?.apiKey) {
        const apiKey = response.data.data.apiKey as string;
        setNewKey(apiKey);
        setNewKeyLastFour(apiKey.slice(-4));
        setNewKeyCreatedAt(new Date().toISOString());
        setExistingKey({
          lastFour: apiKey.slice(-4),
          apiKeyCreatedAt: new Date().toISOString(),
        });
        toast.success(response.data.message || "API key generated successfully");
      }
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to generate API key";
      toast.error(message);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!newKey) return;
    try {
      await navigator.clipboard.writeText(newKey);
      toast.success("API key copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const displayLastFour =
    newKeyLastFour ?? existingKey?.lastFour;
  const displayCreatedAt =
    newKeyCreatedAt ?? existingKey?.apiKeyCreatedAt;
  const hasKey = Boolean(displayLastFour || existingKey?.apiKeyCreatedAt || newKey);

  return (
    <div className="overflow-auto flex-1 rounded-lg border-[1.5px] border-[#b3b3b3] flex flex-col">
      <Toaster />
      <div className="flex flex-row justify-between items-center p-3 md:p-5 lg:p-6 border-b-[1.5px] border-b-[#b3b3b3]">
        <p className="text-base md:text-xl font-semibold leading-none">Settings</p>
      </div>

      <div className="p-3 md:p-5 lg:p-6 space-y-6">
        {/* API Key section */}
        <section className="bg-white rounded-xl border border-[#b3b3b3] p-4 md:p-6">
          <div className="flex flex-row items-center gap-2 mb-4">
            <KeyRound className="w-6 h-6 text-[#485d3a]" />
            <h2 className="text-lg font-semibold text-[#2d3429]">API Key</h2>
          </div>
          <p className="text-sm text-[#626262] mb-4">
            Use your API key to authenticate requests from your systems. Keep it
            secret and never share it. You can regenerate a new key at any time;
            the previous key will stop working.
          </p>

          {loadingKeyInfo ? (
            <div className="flex items-center gap-2 text-[#8a8a8a] text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#485d3a] border-t-transparent" />
              Loading…
            </div>
          ) : (
            <>
              {/* Partially displayed existing key */}
              {hasKey && (
                <div className="mb-4 p-3 rounded-lg bg-[#f6f6f7] border border-[#ececec]">
                  <p className="text-xs font-semibold text-[#8a8a8a] mb-1">
                    Current key
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <code className="font-mono text-sm text-[#626262]">
                      {displayLastFour
                        ? `${MASK_PREFIX}${displayLastFour}`
                        : "••••••••••••••••••••••••"}
                    </code>
                    {displayCreatedAt && (
                      <span className="text-xs text-[#8a8a8a]">
                        Created{" "}
                        {new Date(displayCreatedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* New key shown once with copy */}
              {newKey && (
                <div className="mb-4 p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="flex flex-row items-start gap-2 mb-2">
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-amber-800">
                      Copy this key now. It won&apos;t be shown again.
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-2 flex-wrap">
                    <code className="flex-1 min-w-0 break-all text-sm font-mono text-gray-800 bg-white px-3 py-2 rounded border border-amber-200">
                      {newKey}
                    </code>
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#485d3a] text-white text-sm font-medium hover:bg-[#3d4e2f] transition-colors"
                      title="Copy API key"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={generateApiKey}
                disabled={generating}
                className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  generating
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#b1d29b] text-[#2d3429] hover:bg-[#a0c78a] hover:shadow-md active:scale-[0.98]"
                }`}
              >
                <RefreshCw
                  className={`w-4 h-4 ${generating ? "animate-spin" : ""}`}
                />
                {generating
                  ? "Generating…"
                  : hasKey
                    ? "Regenerate API key"
                    : "Generate API key"}
              </button>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
