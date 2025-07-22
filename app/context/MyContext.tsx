"use client";
import { createContext, ReactNode, useContext, useState } from "react";

interface GeoMappingData {
    addressExistence: string;
    addressResidential: string;
    areaProfile: string;
    buildingColor: string;
    buildingType: string;
    comments: string;
    customerKnown: string;
    customerRelationshipWithAddress: string;
    customerResident: string;
    easeOfLocation: string;
    geoMapping: {
        lat: number;
        lng: number;
    };
    geotaggedImages: string[];
    landMark: string;
    metWith: string;
    nameOfPersonMet: string;
    personMetOthers: string;
    receivedDate: string;
    recordedAudio: string;
    recordedVideo: string;
    relatioshipWithCustomer: string;
    reportUrl: string;
    visitFeedback: string;
}

interface MyContextType {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (value: boolean) => void;
    toggleSidebar: () => void;
    isTaskModalOpen: boolean;
    setIsTaskModalOpen: (value: boolean) => void;
    taskIds: string[];
    setTaskIds: (value: string[]) => void;
    isComplaintsModalOpen: boolean;
    setIsComplaintsModalOpen: (value: boolean) => void;    
    recipientId: string | null;
    setRecipientId: (value: string | null) => void;
    complaintId: string | null;
    setComplaintId: (value: string | null) => void;
    recipientRole: string | null;
    setRecipientRole: (value: string | null) => void;
    activityId: string | null;
    setActivityId: (value: string | null) => void;
    isDeleteTaskModalOpen: boolean;
    setIsDeleteTaskModalOpen: (value: boolean) => void;
    isTaskAssigned : boolean;
    setIsTaskAssigned: (value: boolean) => void;
    isTaskDeleted : boolean;
    setIsTaskDeleted: (value: boolean) => void;
    compId: string | null;
    setCompId: (value: string | null) => void;
    isViewReportModalOpen: boolean;
    setIsViewReportModalOpen: (value: boolean) => void;
    reportData: GeoMappingData | null;
    setReportData: (value: GeoMappingData | null) => void;
    isRejectTaskModalOpen: boolean;
    setIsRejectTaskModalOpen: (value: boolean) => void;
    isNotSent: boolean, 
    setIsNotSent: (value: boolean) => void
}

const myContext = createContext<MyContextType | undefined>(undefined)

export const MyContextProvider = ({children}:{children: ReactNode})=>{
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [taskIds, setTaskIds] = useState<string[]>([]);
    const [isComplaintsModalOpen, setIsComplaintsModalOpen] = useState(false);
    const [recipientId, setRecipientId] = useState<string | null>(null);
    const [complaintId, setComplaintId] = useState<string | null>(null);
    const [recipientRole, setRecipientRole] = useState<string | null>(null);
    const [activityId, setActivityId] = useState<string | null>(null);
    const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
    const [isTaskAssigned, setIsTaskAssigned] = useState(false);
    const [isTaskDeleted, setIsTaskDeleted] = useState(false);
    const [compId, setCompId] = useState<string | null>(null);
    const [isViewReportModalOpen, setIsViewReportModalOpen] = useState(false);
    const [reportData, setReportData] = useState<GeoMappingData | null>(null);
    const [isRejectTaskModalOpen, setIsRejectTaskModalOpen] = useState(false);
    const [isNotSent, setIsNotSent] = useState(false)
    const toggleSidebar = () => {
        if(window.innerWidth >= 1024) return;
        setIsSidebarOpen(!isSidebarOpen);
    }
    return (
        <myContext.Provider value={{
            isSidebarOpen,
            setIsSidebarOpen,
            toggleSidebar,
            isTaskModalOpen,
            setIsTaskModalOpen,
            taskIds,
            setTaskIds,
            isComplaintsModalOpen,
            setIsComplaintsModalOpen,
            recipientId,
            setRecipientId,
            complaintId,
            setComplaintId,
            recipientRole,
            setRecipientRole,
            activityId,
            setActivityId,
            isDeleteTaskModalOpen,
            setIsDeleteTaskModalOpen,
            isTaskAssigned, 
            setIsTaskAssigned,
            isTaskDeleted, 
            setIsTaskDeleted,
            compId,
            setCompId,
            isViewReportModalOpen,
            setIsViewReportModalOpen,
            reportData,
            setReportData,
            isRejectTaskModalOpen,
            setIsRejectTaskModalOpen,
            isNotSent, 
            setIsNotSent
        }}>
            {children}
        </myContext.Provider>
    )
}


export const useMyContext = () => {
    const context = useContext(myContext)
    if (!context) {
        throw new Error("useMyContext must be used within a MyContextProvider");
    }
    return context;
}