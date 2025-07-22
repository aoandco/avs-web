/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
  X,
  MapPin,
  User,
  Home,
  Calendar,
  Headphones,
  Video,
  Image as ImageIcon,
  ExternalLink,
  CircleAlertIcon,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import { useMyContext } from "@/app/context/MyContext";
import axios from "axios";
import toast from "react-hot-toast";

export default function ViewReportModal() {
    const token = sessionStorage.getItem("token");
  const { reportData, setIsViewReportModalOpen, setReportData, setTaskIds, taskIds } = useMyContext();
  const [isApproving, setIsApproving] = useState(false);
  const formatValue = (
    value: string | number | boolean | string[] | null | undefined
  ): string => {
    if (value === null || value === undefined || value === "") {
      return "N/A";
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(", ") : "N/A";
    }
    return value.toString();
  };

  const handleApprovedReport = async () => {
    if (!reportData) return;
    if (reportData.geotaggedImages.length >= 1) {
      const endpoint = "https://bayog-production.up.railway.app/v1/admin/approve-report";
      setIsApproving(true);
      try {
        const res = await axios.post(
          endpoint,
          {
            taskIds: taskIds
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.status === 200) {
          toast.success(res.data.message);
          setTimeout(() => {
            setIsViewReportModalOpen(false);
            setReportData(null);
            setTaskIds([]);
          }, 1000);
        }
      } catch (err: any) {
        toast.error(
          err.response ? err.response.data.message : "Failed to approve report"
        );
      } finally {
        setIsApproving(false);
      }
    }
  };

  const handleClose = () => {
    setIsViewReportModalOpen(false);
    setReportData(null);
    setTaskIds([]);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const InfoSection = ({
    title,
    icon: Icon,
    children,
  }: {
    title: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    children: React.ReactNode;
  }) => (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <div className="flex items-center mb-3">
        <Icon className="text-[#485d3a] text-xl mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );

  const InfoRow = ({
    label,
    value,
  }: {
    label: string;
    value: string | number | boolean | string[] | null | undefined;
  }) => (
    <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 pb-2">
      <span className="font-medium text-gray-700 sm:w-1/3 mb-1 sm:mb-0">
        {label}:
      </span>
      <span className="text-gray-900 sm:w-2/3 break-words">
        {formatValue(value)}
      </span>
    </div>
  );

  if (!reportData) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-full z-10">
      <div
        onClick={handleClose}
        className="absolute top-0 left-0 w-full h-full bg-black opacity-70 z-20"
      ></div>

      <div className="relative z-30 bg-white rounded-lg max-w-4xl w-full max-h-[90vh] mx-4 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Verification Report Details
          </h2>
          <button onClick={handleClose} className="cursor-pointer">
            <X className="text-2xl text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Location Information */}
          <InfoSection title="Location Information" icon={MapPin}>
            <InfoRow label="Latitude" value={reportData.geoMapping?.lat} />
            <InfoRow label="Longitude" value={reportData.geoMapping?.lng} />
            <InfoRow label="Landmark" value={reportData.landMark} />
            <InfoRow
              label="Ease of Location"
              value={reportData.easeOfLocation}
            />
          </InfoSection>

          {/* Address Details */}
          <InfoSection title="Address Details" icon={Home}>
            <InfoRow
              label="Address Existence"
              value={reportData.addressExistence}
            />
            <InfoRow
              label="Address Residential"
              value={reportData.addressResidential}
            />
            <InfoRow label="Area Profile" value={reportData.areaProfile} />
            <InfoRow label="Building Type" value={reportData.buildingType} />
            <InfoRow label="Building Color" value={reportData.buildingColor} />
          </InfoSection>

          {/* Customer Information */}
          <InfoSection title="Customer Information" icon={User}>
            <InfoRow label="Customer Known" value={reportData.customerKnown} />
            <InfoRow
              label="Customer Resident"
              value={reportData.customerResident}
            />
            <InfoRow
              label="Customer Relationship with Address"
              value={reportData.customerRelationshipWithAddress}
            />
            <InfoRow label="Met With" value={reportData.metWith} />
            <InfoRow
              label="Name of Person Met"
              value={reportData.nameOfPersonMet}
            />
            <InfoRow
              label="Person Met Others"
              value={reportData.personMetOthers}
            />
            <InfoRow
              label="Relationship with Customer"
              value={reportData.relatioshipWithCustomer}
            />
          </InfoSection>

          {/* Visit Details */}
          <InfoSection title="Visit Details" icon={Calendar}>
            <InfoRow
              label="Received Date"
              value={formatDate(reportData.receivedDate)}
            />
            <InfoRow label="Visit Feedback" value={reportData.visitFeedback} />
            <InfoRow label="Comments" value={reportData.comments} />
          </InfoSection>

          {/* Media Files */}
          <InfoSection title="Media Files" icon={ImageIcon}>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 pb-2">
                <span className="font-medium text-gray-700 sm:w-1/3 mb-1 sm:mb-0 flex items-center">
                  <ImageIcon className="mr-1" /> Geotagged Images:
                </span>
                <div className="sm:w-2/3">
                  {reportData.geotaggedImages &&
                  reportData.geotaggedImages.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {reportData.geotaggedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={image}
                            alt={`Geotagged ${index + 1}`}
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-300 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                            onClick={() => window.open(image, "_blank")}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">No images available</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 pb-2">
                <span className="font-medium text-gray-700 sm:w-1/3 mb-1 sm:mb-0 flex items-center">
                  <Headphones className="mr-1" /> Recorded Audio:
                </span>
                <div className="sm:w-2/3">
                  {reportData.recordedAudio ? (
                    <audio controls className="w-full max-w-md">
                      <source
                        src={reportData.recordedAudio}
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  ) : (
                    <span className="text-gray-500">No audio available</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 pb-2">
                <span className="font-medium text-gray-700 sm:w-1/3 mb-1 sm:mb-0 flex items-center">
                  <Video className="mr-1" /> Recorded Video:
                </span>
                <div className="sm:w-2/3">
                  {reportData.recordedVideo ? (
                    <video controls className="w-full max-w-md rounded-lg">
                      <source src={reportData.recordedVideo} type="video/mp4" />
                      Your browser does not support the video element.
                    </video>
                  ) : (
                    <span className="text-gray-500">No video available</span>
                  )}
                </div>
              </div>
            </div>
          </InfoSection>

          {/* Report Links */}
          {reportData.reportUrl && (
            <InfoSection title="Report Links" icon={ExternalLink}>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-medium text-gray-700 sm:w-1/3 mb-1 sm:mb-0">
                  Report URL:
                </span>
                <div className="sm:w-2/3">
                  <a
                    href={reportData.reportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline break-all inline-flex items-center"
                  >
                    <ExternalLink className="mr-1" />
                    View Full Report
                  </a>
                </div>
              </div>
            </InfoSection>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex justify-end gap-4">
            <button
              onClick={handleClose}
              className="cursor-pointer px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 hover:shadow-lg active:scale-95 transition-all duration-200"
            >
              <CircleAlertIcon className="inline mr-2" />
              Close
            </button>
            {reportData.geotaggedImages.length > 0 && (
              <button
                onClick={handleApprovedReport}
                disabled={isApproving}
                className="cursor-pointer disabled:cursor-not-allowed px-6 py-2 bg-[#485d3a] text-white rounded-lg hover:bg-[#3a4a2e] hover:shadow-lg active:scale-95 transition-all duration-200"
              >
                <CheckCircle className="inline mr-2" />
                {
                    isApproving ? "Approving..." : "Approve Report"
                }
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
