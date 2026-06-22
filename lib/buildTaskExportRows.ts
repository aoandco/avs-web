type TaskUploadRef =
  | string
  | null
  | {
      fileName?: string;
      uploadedAt?: string;
    };

type TaskFeedback = {
  addressExistence?: string;
  addressResidential?: string;
  areaProfile?: string;
  buildingColor?: string;
  buildingType?: string;
  comments?: string;
  additionalComments?: string;
  customerKnown?: string;
  customerRelationshipWithAddress?: string;
  customerResident?: string;
  easeOfLocation?: string;
  metWith?: string;
  nameOfPersonMet?: string;
  personMetOthers?: string;
  relatioshipWithCustomer?: string;
  landMark?: string;
  visitFeedback?: string;
  receivedDate?: string;
  recordedAudio?: string;
  recordedVideo?: string;
  reportUrl?: string;
  geoMapping?: {
    lat?: number;
    lng?: number;
  };
  geotaggedImages?: string[];
};

export type TaskExportSource = {
  _id: string;
  activityId?: string | null;
  cif?: string | null;
  customerName?: string;
  verificationAddress?: string;
  fullAddress?: string;
  additionalInformation?: string;
  street?: string;
  area?: string;
  city?: string;
  state?: string;
  country?: string;
  landmark?: string;
  postalCode?: string;
  status?: string;
  createdAt?: string;
  reportIsApproved?: boolean;
  uploadFileName?: string | null;
  taskUploadId?: TaskUploadRef;
  taskUpload?: {
    fileName?: string;
    uploadedAt?: string;
  };
  companyName?: string;
  clientId?: {
    companyName?: string;
  };
  client?: {
    companyName?: string;
  };
  address?: {
    fullAddress?: string;
    additionalInformation?: string;
    street?: string;
    area?: string;
    city?: string;
    state?: string;
    country?: string;
    landmark?: string;
    postalCode?: string;
  };
  feedback?: TaskFeedback;
  addressExistence?: string;
  addressResidential?: string;
  areaProfile?: string;
  buildingColor?: string;
  buildingType?: string;
  comments?: string;
  additionalComments?: string;
  customerKnown?: string;
  customerRelationshipWithAddress?: string;
  customerResident?: string;
  easeOfLocation?: string;
  metWith?: string;
  nameOfPersonMet?: string;
  personMetOthers?: string;
  relatioshipWithCustomer?: string;
  landMark?: string;
  visitFeedback?: string;
  receivedDate?: string;
  recordedAudio?: string;
  recordedVideo?: string;
  reportUrl?: string;
  latitude?: number;
  longitude?: number;
  firstGeotaggedImage?: string | null;
  secondGeotaggedImage?: string | null;
};

type BuildTaskExportRowsOptions = {
  includeCompanyName?: boolean;
};

function formatExportDate(value?: string | null): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
}

function getUploadFileName(task: TaskExportSource): string {
  if (task.uploadFileName) {
    return task.uploadFileName;
  }

  if (task.taskUploadId && typeof task.taskUploadId === "object") {
    return task.taskUploadId.fileName || "";
  }

  if (task.taskUpload?.fileName) {
    return task.taskUpload.fileName;
  }

  return "";
}

function getCompanyName(task: TaskExportSource): string {
  return (
    task.companyName ||
    task.clientId?.companyName ||
    task.client?.companyName ||
    "N/A"
  );
}

function getFeedbackValue(
  task: TaskExportSource,
  key: keyof TaskFeedback
): string {
  const feedbackValue = task.feedback?.[key];
  if (feedbackValue !== undefined && feedbackValue !== null && feedbackValue !== "") {
    return String(feedbackValue);
  }

  const topLevelValue = task[key as keyof TaskExportSource];
  if (
    topLevelValue !== undefined &&
    topLevelValue !== null &&
    topLevelValue !== ""
  ) {
    return String(topLevelValue);
  }

  return "";
}

export function buildTaskExportRow(
  task: TaskExportSource,
  index: number,
  options: BuildTaskExportRowsOptions = {}
) {
  const feedback = task.feedback || {};
  const address = task.address || {};
  const geotaggedImages = feedback.geotaggedImages || [];

  const verificationAddress =
    task.fullAddress ||
    address.fullAddress ||
    task.verificationAddress ||
    "";

  const row: Record<string, string | number> = {
    "S/N": index + 1,
    "Task ID": task._id,
  };

  if (options.includeCompanyName) {
    row["Company Name"] = getCompanyName(task);
  }

  Object.assign(row, {
    "Upload File Name": getUploadFileName(task),
    "Activity ID": task.activityId || "",
    CIF: task.cif || "",
    "Customer Name": task.customerName || "",
    "Verification Address": verificationAddress,
    "Additional Information":
      task.additionalInformation || address.additionalInformation || "",
    Street: task.street || address.street || "",
    Area: task.area || address.area || "",
    City: task.city || address.city || "",
    State: task.state || address.state || "",
    Country: task.country || address.country || "",
    Landmark: task.landmark || address.landmark || "",
    "Postal Code": task.postalCode || address.postalCode || "",
    Status: task.status || "",
    "Report Approved": task.reportIsApproved ? "Yes" : "No",
    "Date Created": formatExportDate(task.createdAt),
    "Address Existence": getFeedbackValue(task, "addressExistence"),
    "Address Residential": getFeedbackValue(task, "addressResidential"),
    "Area Profile": getFeedbackValue(task, "areaProfile"),
    "Building Color": getFeedbackValue(task, "buildingColor"),
    "Building Type": getFeedbackValue(task, "buildingType"),
    Comments: getFeedbackValue(task, "comments"),
    "Additional Comments": getFeedbackValue(task, "additionalComments"),
    "Customer Known": getFeedbackValue(task, "customerKnown"),
    "Customer Relationship with Address": getFeedbackValue(
      task,
      "customerRelationshipWithAddress"
    ),
    "Customer Resident": getFeedbackValue(task, "customerResident"),
    "Ease of Location": getFeedbackValue(task, "easeOfLocation"),
    "Met With": getFeedbackValue(task, "metWith"),
    "Name of Person Met": getFeedbackValue(task, "nameOfPersonMet"),
    "Person Met Others": getFeedbackValue(task, "personMetOthers"),
    "Relationship With Customer": getFeedbackValue(
      task,
      "relatioshipWithCustomer"
    ),
    "Landmark (Visit)": getFeedbackValue(task, "landMark"),
    "Visit Feedback": getFeedbackValue(task, "visitFeedback"),
    "Received Date": formatExportDate(
      task.receivedDate || feedback.receivedDate
    ),
    Latitude: task.latitude ?? feedback.geoMapping?.lat ?? "",
    Longitude: task.longitude ?? feedback.geoMapping?.lng ?? "",
    "First Geotagged Image":
      task.firstGeotaggedImage || geotaggedImages[0] || "",
    "Second Geotagged Image":
      task.secondGeotaggedImage || geotaggedImages[1] || "",
    "Recorded Audio": getFeedbackValue(task, "recordedAudio"),
    "Recorded Video": getFeedbackValue(task, "recordedVideo"),
    "Report URL": task.reportUrl || feedback.reportUrl || "",
  });

  return row;
}

export function buildTaskExportRows(
  tasks: TaskExportSource[],
  options: BuildTaskExportRowsOptions = {}
) {
  return tasks.map((task, index) => buildTaskExportRow(task, index, options));
}

export function getTaskExportColumnWidths(
  options: BuildTaskExportRowsOptions = {}
) {
  const widths = [
    { wch: 5 }, // S/N
    { wch: 24 }, // Task ID
  ];

  if (options.includeCompanyName) {
    widths.push({ wch: 20 }); // Company Name
  }

  widths.push(
    { wch: 24 }, // Upload File Name
    { wch: 18 }, // Activity ID
    { wch: 18 }, // CIF
    { wch: 22 }, // Customer Name
    { wch: 40 }, // Verification Address
    { wch: 28 }, // Additional Information
    { wch: 28 }, // Street
    { wch: 20 }, // Area
    { wch: 18 }, // City
    { wch: 18 }, // State
    { wch: 16 }, // Country
    { wch: 22 }, // Landmark
    { wch: 14 }, // Postal Code
    { wch: 14 }, // Status
    { wch: 16 }, // Report Approved
    { wch: 22 }, // Date Created
    { wch: 18 }, // Address Existence
    { wch: 20 }, // Address Residential
    { wch: 16 }, // Area Profile
    { wch: 16 }, // Building Color
    { wch: 16 }, // Building Type
    { wch: 30 }, // Comments
    { wch: 28 }, // Additional Comments
    { wch: 16 }, // Customer Known
    { wch: 30 }, // Customer Relationship with Address
    { wch: 18 }, // Customer Resident
    { wch: 18 }, // Ease of Location
    { wch: 14 }, // Met With
    { wch: 22 }, // Name of Person Met
    { wch: 18 }, // Person Met Others
    { wch: 28 }, // Relationship With Customer
    { wch: 22 }, // Landmark (Visit)
    { wch: 24 }, // Visit Feedback
    { wch: 22 }, // Received Date
    { wch: 14 }, // Latitude
    { wch: 14 }, // Longitude
    { wch: 40 }, // First Geotagged Image
    { wch: 40 }, // Second Geotagged Image
    { wch: 40 }, // Recorded Audio
    { wch: 40 }, // Recorded Video
    { wch: 50 } // Report URL
  );

  return widths;
}
