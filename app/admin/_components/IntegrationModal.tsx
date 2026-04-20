"use client";
import { apiBase } from "@/lib/apiBase";
import { X } from "lucide-react";
import axios from "axios";
import React, { ChangeEvent, FormEvent, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface IntegrationModalType {
  handleClose: () => void;
  clientId: string;
  companyName: string;
  getClients?: () => void;
}

export default function IntegrationModal({
  handleClose,
  clientId,
  companyName,
  getClients,
}: IntegrationModalType) {
  const token = sessionStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    avsEndpoint: "",
    subscriptionKey: "",
    vendorExternalId: "",
    integrationEnabled: false,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const submitIntegration = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.avsEndpoint || !form.subscriptionKey || !form.vendorExternalId) {
      toast.error("AVS Endpoint, Subscription Key and Vendor External ID are required");
      return;
    }
    setLoading(true);
    try {
      const endpoint = `${apiBase()}/v1/admin/client/integration/${clientId}`;
      const response = await axios.post(endpoint, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        getClients?.();
        setTimeout(handleClose, 1000);
      }
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to update integration";
      toast.error(message);
    } finally {
      setLoading(false);
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
          Client Integration
        </h2>
        <p className="text-center text-[#8a8a8a] text-sm mb-6">{companyName}</p>
        <form onSubmit={submitIntegration} className="space-y-5">
          <div className="pl-0 sm:pl-4 md:pl-6 flex flex-col gap-2">
            <label className="font-semibold text-base">AVS Endpoint</label>
            <input
              type="url"
              name="avsEndpoint"
              value={form.avsEndpoint}
              onChange={handleChange}
              required
              className="w-full border border-[#b3b3b3] rounded-md p-2 text-black"
              placeholder="https://..."
            />
          </div>
          <div className="pl-0 sm:pl-4 md:pl-6 flex flex-col gap-2">
            <label className="font-semibold text-base">Subscription Key</label>
            <input
              type="text"
              name="subscriptionKey"
              value={form.subscriptionKey}
              onChange={handleChange}
              required
              className="w-full border border-[#b3b3b3] rounded-md p-2 text-black"
              placeholder="Subscription key"
            />
          </div>
          <div className="pl-0 sm:pl-4 md:pl-6 flex flex-col gap-2">
            <label className="font-semibold text-base">Vendor External ID</label>
            <input
              type="text"
              name="vendorExternalId"
              value={form.vendorExternalId}
              onChange={handleChange}
              required
              className="w-full border border-[#b3b3b3] rounded-md p-2 text-black"
              placeholder="Vendor external ID"
            />
          </div>
          <div className="pl-0 sm:pl-4 md:pl-6 flex flex-row items-center gap-2">
            <input
              type="checkbox"
              id="integrationEnabled"
              name="integrationEnabled"
              checked={form.integrationEnabled}
              onChange={handleChange}
              className="rounded border-[#b3b3b3]"
            />
            <label htmlFor="integrationEnabled" className="font-semibold text-base">
              Integration enabled
            </label>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="cursor-pointer py-3 font-medium w-full sm:w-[140px] border border-black rounded-md bg-transparent hover:bg-gray-100 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`cursor-pointer disabled:cursor-not-allowed font-medium w-full sm:w-[180px] py-3 rounded-md transition-all duration-200 ${
                loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#b1d29b] hover:bg-[#a0c78a] hover:shadow-md active:scale-95"
              }`}
            >
              {loading ? "Saving..." : "Save Integration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
