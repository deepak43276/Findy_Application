"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface SavedJobsContextType {
  savedJobs: number[];
  toggleSaveJob: (jobId: number) => void;
}

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(undefined);

export const SavedJobsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  // ✅ Fetch saved jobs when user logs in
  useEffect(() => {
    if (!user?.id) {
      setSavedJobs([]);
      return;
    }

    fetch(`http://localhost:8081/api/saved-jobs/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        const jobIds = Array.isArray(data)
          ? data.map((item: any) => item.jobId)
          : [];
        setSavedJobs(jobIds);
      })
      .catch((err) => {
        console.error("Error fetching saved jobs:", err);
        setSavedJobs([]);
      });
  }, [user]);

  // ✅ Toggle job save/unsave
  const toggleSaveJob = async (jobId: number) => {
    if (!user?.id) return;
    const isSaved = savedJobs.includes(jobId);

    // Optimistic UI update
    setSavedJobs((prev) =>
      isSaved ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );

    try {
      const url = `http://localhost:8081/api/saved-jobs?userId=${user.id}&jobId=${jobId}`;
      const method = isSaved ? "DELETE" : "POST";

      const response = await fetch(url, { method });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Server error (${response.status}):`, errorText);
        throw new Error(`Failed to ${isSaved ? "unsave" : "save"} job`);
      }

      const updatedJobIds = await response.json();
      setSavedJobs(updatedJobIds); // ✅ Sync with backend
      

    } catch (error) {
     
      // Rollback UI
      setSavedJobs((prev) =>
        isSaved ? [...prev, jobId] : prev.filter((id) => id !== jobId)
      );
    }
  };

  return (
    <SavedJobsContext.Provider value={{ savedJobs, toggleSaveJob }}>
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = () => {
  const context = useContext(SavedJobsContext);
  if (!context) throw new Error("useSavedJobs must be used within a SavedJobsProvider");
  return context;
};
