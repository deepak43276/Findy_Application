"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface SavedJobDetails {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  skills: string[];
  description: string;
  requirements?: string;
  experienceLevel?: string;
}

interface SavedJobsContextType {
  savedJobs: number[];
  savedJobDetails: SavedJobDetails[];
  toggleSaveJob: (jobId: number) => void;
  loading: boolean;
}

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(undefined);

// ✅ Use env variable for backend API (configurable per environment)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

export const SavedJobsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [savedJobDetails, setSavedJobDetails] = useState<SavedJobDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Fetch saved jobs and details when user logs in
  useEffect(() => {
    if (!user?.id) {
      setSavedJobs([]);
      setSavedJobDetails([]);
      setLoading(false);
      return;
    }

    const fetchSavedJobs = async () => {
      try {
        setLoading(true);

        // 1️⃣ Fetch saved job IDs
        const res = await fetch(`${API_BASE_URL}/api/saved-jobs/${user.id}`);
        if (!res.ok) throw new Error("Failed to fetch saved jobs");
        const data = await res.json();
        const jobIds = Array.isArray(data) ? data.map((item: any) => item.jobId) : [];

        setSavedJobs(jobIds);

        // 2️⃣ Fetch job details if there are saved jobs
        if (jobIds.length > 0) {
          const detailsRes = await fetch(
            `${API_BASE_URL}/api/saved-jobs/jobs/by-ids?ids=${jobIds.join(",")}`
          );
          if (detailsRes.ok) {
            const details = await detailsRes.json();
            setSavedJobDetails(details);
          } else {
            setSavedJobDetails([]);
          }
        } else {
          setSavedJobDetails([]);
        }
      } catch (err) {
        console.error("Error fetching saved jobs:", err);
        setSavedJobs([]);
        setSavedJobDetails([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [user]);

  // ✅ Toggle job save/unsave and update details immediately
  const toggleSaveJob = async (jobId: number) => {
    if (!user?.id) return;

    const isSaved = savedJobs.includes(jobId);
    console.log(`🔄 Toggling job ID ${jobId}. Currently saved: ${isSaved}`);

    // Optimistic UI update
    setSavedJobs((prev) =>
      isSaved ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
    if (!isSaved) {
      // If saving, fetch job detail and add
      const resDetail = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`);
      if (resDetail.ok) {
        const jobDetail = await resDetail.json();
        setSavedJobDetails((prev) => [...prev, jobDetail]);
      }
    } else {
      // If unsaving, optimistically remove details
      setSavedJobDetails((prev) => prev.filter((job) => job.id !== jobId));
    }

    try {
      const endpoint = `${API_BASE_URL}/api/saved-jobs?userId=${user.id}&jobId=${jobId}`;
      const method = isSaved ? "DELETE" : "POST";

      const res = await fetch(endpoint, { method });
      if (!res.ok) throw new Error(`Failed to ${isSaved ? "unsave" : "save"} job`);

      // ✅ Sync with server response (list of job IDs)
      const updatedJobIds = await res.json();
      if (Array.isArray(updatedJobIds)) {
        setSavedJobs(updatedJobIds);

        // Fetch updated job details list
        if (updatedJobIds.length > 0) {
          const detailsRes = await fetch(
            `${API_BASE_URL}/api/saved-jobs/jobs/by-ids?ids=${updatedJobIds.join(",")}`
          );
          if (detailsRes.ok) {
            const details = await detailsRes.json();
            setSavedJobDetails(details);
          }
        } else {
          setSavedJobDetails([]);
        }
      }
    } catch (error) {
      console.error("❌ Failed to toggle saved job:", error);

      // Rollback UI if API fails
      setSavedJobs((prev) =>
        isSaved ? [...prev, jobId] : prev.filter((id) => id !== jobId)
      );

      // Rollback details
      if (isSaved) {
        const resDetail = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`);
        if (resDetail.ok) {
          const jobDetail = await resDetail.json();
          setSavedJobDetails((prev) => [...prev, jobDetail]);
        }
      } else {
        setSavedJobDetails((prev) => prev.filter((job) => job.id !== jobId));
      }
    }
  };

  return (
    <SavedJobsContext.Provider value={{ savedJobs, savedJobDetails, toggleSaveJob, loading }}>
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = () => {
  const context = useContext(SavedJobsContext);
  if (!context) throw new Error("useSavedJobs must be used within a SavedJobsProvider");
  return context;
};
