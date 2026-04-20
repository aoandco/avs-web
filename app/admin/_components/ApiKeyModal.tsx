"use client";
import { apiBase } from "@/lib/apiBase";
import { Copy, Key, X } from "lucide-react";
import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface ApiKeyModalType {
  handleClose: () => void;
  clientId: string;
  companyName: string;
}

interface GeneratedKeyData {
  apiKey: string;
  clientId: string;
  clientEmail: string;
  companyName: string;
  apiKeyCreatedAt: string;
}

export default function ApiKeyModal({
  handleClose,
  clientId,
  companyName,
}: ApiKeyModalType) {
  const token = sessionStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<GeneratedKeyData | null>(null);

  const generateApiKey = async () => {
    setLoading(true);
    setGenerated(null);
    try {
      const endpoint = `${apiBase()}/v1/admin/client/generate-api-key/${clientId}`;
      const response = await axios.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 201 && response.data?.data) {
        setGenerated(response.data.data);
        toast.success(response.data.message || "API key generated successfully");
      }
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to generate API key";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!generated?.apiKey) return;
    try {
      await navigator.clipboard.writeText(generated.apiKey);
      toast.success("API key copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-full z-10">
      <Toaster />
      <div
        onClick={handleClose}
        className="absolute top-0 left-0 w-full h-full bg-black opacity-70"
      />
      <div className="relative z-20 bg-white rounded-lg pt-4 px-4 pb-8 max-w-xl w-full max-h-[85vh] overflow-y-auto">
        <X
          onClick={handleClose}
          className="absolute top-4 right-4 cursor-pointer"
        />
        <h2 className="text-xl font-semibold mb-2 text-center">
          Client API Key
        </h2>
        <p className="text-center text-[#8a8a8a] text-sm mb-6">{companyName}</p>

        {!generated ? (
          <div className="space-y-4">
            <p className="text-sm text-[#8a8a8a] text-center">
              Generate a new API key for this client. The key will be shown
              once—copy and store it securely.
            </p>
            <button
              type="button"
              onClick={generateApiKey}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-md font-medium transition-all duration-200 ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#b1d29b] hover:bg-[#a0c78a] hover:shadow-md active:scale-95"
              }`}
            >
              <Key className="w-5 h-5" />
              {loading ? "Generating..." : "Generate API Key"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-amber-700 text-sm font-medium text-center bg-amber-50 border border-amber-200 rounded-md py-2 px-3">
              Copy this key now. It won&apos;t be shown again.
            </p>
            <div className="border border-[#b3b3b3] rounded-md p-3 bg-gray-50">
              <p className="text-xs font-semibold text-[#8a8a8a] mb-1">
                API Key
              </p>
              <div className="flex flex-row items-center gap-2">
                <code className="flex-1 break-all text-sm font-mono text-gray-800 select-all">
                  {generated.apiKey}
                </code>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#485d3a] text-white text-sm font-medium hover:bg-[#3d4e2f] transition-colors"
                  title="Copy API key"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
            </div>
            {generated.apiKeyCreatedAt && (
              <p className="text-xs text-[#8a8a8a] text-center">
                Generated:{" "}
                {new Date(generated.apiKeyCreatedAt).toLocaleString()}
              </p>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3 font-medium border border-black rounded-md bg-transparent hover:bg-gray-100 transition-all duration-200"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
