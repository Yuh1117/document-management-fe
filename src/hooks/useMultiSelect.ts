import { useState } from "react";

export const useMultiSelect = () => {
    const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
    const [selectedDocs, setSelectedDocs] = useState<number[]>([]);
    const [selectedFolders, setSelectedFolders] = useState<number[]>([]);

    const toggleMode = () => {
        setIsMultiSelectMode((prev) => !prev);
        setSelectedDocs([]);
        setSelectedFolders([]);
    };

    const reset = () => {
        setIsMultiSelectMode(false);
        setSelectedDocs([]);
        setSelectedFolders([]);
    };

    return {
        isMultiSelectMode,
        setIsMultiSelectMode,
        selectedDocs,
        setSelectedDocs,
        selectedFolders,
        setSelectedFolders,
        toggleMode,
        reset,
    };
};