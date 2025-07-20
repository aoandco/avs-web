"use client";
import { createContext, ReactNode, useContext, useState } from "react";

interface MyContextType {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (value: boolean) => void;
    toggleSidebar: () => void;
    isTaskModalOpen: boolean;
    setIsTaskModalOpen: (value: boolean) => void;
    taskId: string | null;
    setTaskId: (value: string | null) => void;
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

}

const myContext = createContext<MyContextType | undefined>(undefined)

export const MyContextProvider = ({children}:{children: ReactNode})=>{
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [taskId, setTaskId] = useState<string | null>(null);
    const [isComplaintsModalOpen, setIsComplaintsModalOpen] = useState(false);
    const [recipientId, setRecipientId] = useState<string | null>(null);
    const [complaintId, setComplaintId] = useState<string | null>(null);
    const [recipientRole, setRecipientRole] = useState<string | null>(null);
    const [activityId, setActivityId] = useState<string | null>(null);
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
            taskId,
            setTaskId,
            isComplaintsModalOpen,
            setIsComplaintsModalOpen,
            recipientId,
            setRecipientId,
            complaintId,
            setComplaintId,
            recipientRole,
            setRecipientRole,
            activityId,
            setActivityId
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