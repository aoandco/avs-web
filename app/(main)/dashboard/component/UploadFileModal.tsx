import axios from "axios";
import { X, UploadCloud, Upload } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function UploadFileModal({
  handleClose,
  getdashboardStats
}: {
  handleClose: () => void;
  getdashboardStats: () => void
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const token = sessionStorage.getItem("token");

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith(".xlsx")) {
        setSelectedFile(file);
      } else {
        toast.error("Please upload file in Excel Format");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith(".xlsx")) {
        setSelectedFile(file);
      } else {
        toast.error("Please upload file in Excel Format");
      }
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const uploadTasks = async () => {
    const endpoint =
      `${process.env.NEXT_PUBLIC_API_URL}/v1/client/upload-tasks`;
    if (!selectedFile) return;
    setIsUploading(true);
    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const response = await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("File uploaded successfully");
        setSelectedFile(null);
        getdashboardStats()
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An error occurred during upload.");
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-full z-10">
      <Toaster />
      <div
        onClick={handleClose}
        className="absolute top-0 left-0 w-full h-full bg-black opacity-70"
      ></div>
      <div className="relative z-20 bg-white rounded-lg pt-4 px-4 pb-8 max-w-xl w-full max-h-[80vh] overflow-y-auto">
        <X
          onClick={handleClose}
          className="absolute top-4 right-4 cursor-pointer"
        />
        <h2 className="text-xl font-semibold mb-4 text-center">
          Upload Tasks File
        </h2>
        <div
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors duration-200 ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-100"
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
          style={{ cursor: "pointer" }}
        >
          <UploadCloud size={48} className="text-blue-500 mb-2" />
          <p className="mb-2 text-gray-700">
            Drag & drop your <span className="font-bold">.xlsx</span> file here,
            or <span className="underline text-blue-600">browse</span>
          </p>
          <input
            type="file"
            accept=".xlsx"
            ref={inputRef}
            className="hidden"
            onChange={handleChange}
          />
          {selectedFile && (
            <div className="mt-4 text-green-600 font-medium">
              {selectedFile.name}
            </div>
          )}
        </div>
        <div className="flex flex-row justify-end gap-4 mt-6">
          <a
            href={"/address-upload-template.xlsx"}
            download
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-150 shadow-sm border border-gray-300 flex items-center gap-2"
          >
            <Upload className='size-5'/>
            Template
          </a>
          <button
            onClick={uploadTasks}
            disabled={!selectedFile || isUploading}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-150 shadow-sm border border-blue-700 flex items-center gap-2 ${
              !selectedFile || isUploading
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            <UploadCloud className="size-5" />
            {isUploading ? "Uploading..." : "Upload Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
