'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ViewModeContextType {
    isStaticView: boolean;
    setStaticView: (value: boolean) => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export function ViewModeProvider({ children }: { children: ReactNode }) {
    const [isStaticView, setStaticView] = useState(false);

    return (
        <ViewModeContext.Provider value={{ isStaticView, setStaticView }}>
            {children}
        </ViewModeContext.Provider>
    );
}

export function useViewMode() {
    const context = useContext(ViewModeContext);
    if (context === undefined) {
        throw new Error('useViewMode must be used within a ViewModeProvider');
    }
    return context;
}
