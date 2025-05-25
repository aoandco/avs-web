"use client";
import { createContext, ReactNode, useContext, useState } from "react";

interface MyContextType {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (value: boolean) => void;
    toggleSidebar: () => void;
}

const myContext = createContext<MyContextType | undefined>(undefined)

export const MyContextProvider = ({children}:{children: ReactNode})=>{
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    const toggleSidebar = () => {
        if(window.innerWidth >= 1024) return;
        setIsSidebarOpen(!isSidebarOpen);
    }
    return (
        <myContext.Provider value={{isSidebarOpen,setIsSidebarOpen,toggleSidebar}}>
            {children}
        </myContext.Provider>
    )
}


export const useMyContext = () => {
    const context = useContext(myContext)
    if (!context) {
        throw new Error("useMyCOntext must be used within a MyContextProvider");
    }
    return context;
}