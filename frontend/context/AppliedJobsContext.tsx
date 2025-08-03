// context/AppliedJobsContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface AppliedJobsContextType {
  appliedJobs: number[];
  applyJob: (jobId: number) => Promise<void>;
  refreshAppliedJobs: () => Promise<void>;
  toggleApplyJob: (jobId: number) => void;
}

const AppliedJobsContext = createContext<AppliedJobsContextType>({
  appliedJobs: [],
  applyJob: async () => {},
  refreshAppliedJobs: async () => {},
  toggleApplyJob: () => {},
});

// ✅ Use env variable for backend API (configurable per environment)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

export const AppliedJobsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, token } = useAuth();
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);

  // ✅ Fetch applied jobs from backend with Authorization
  const fetchAppliedJobs = async () => {
    if (!user || !token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/applied-jobs/${user.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Failed to fetch applied jobs (Status: ${res.status})`);

      const data = await res.json();
      const jobIds = Array.isArray(data) ? data.map((job: any) => job.jobId) : [];
      setAppliedJobs(jobIds);
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
    }
  };

  // ✅ Load applied jobs on login
  useEffect(() => {
    if (user && token) {
      fetchAppliedJobs();
    } else {
      setAppliedJobs([]); // Clear on logout
    }
  }, [user, token]);

  // ✅ Apply for a job and persist to DB
  const applyJob = async (jobId: number) => {
    if (!user || !token) return;
    if (appliedJobs.includes(jobId)) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/applied-jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id, jobId }),
      });

      const result = await res.json();

      if (res.ok) {
        setAppliedJobs((prev) => [...prev, jobId]);
        console.log("Job applied successfully:", result);
      } else {
        console.warn(result.message || "Failed to apply job");
      }
    } catch (err) {
      console.error("Error applying job:", err);
    }
  };

  // ✅ Toggle job application locally (UI only)
  const toggleApplyJob = (jobId: number) => {
    setAppliedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  return (
    <AppliedJobsContext.Provider
      value={{
        appliedJobs,
        applyJob,
        refreshAppliedJobs: fetchAppliedJobs,
        toggleApplyJob,
      }}
    >
      {children}
    </AppliedJobsContext.Provider>
  );
};

export const useAppliedJobs = () => useContext(AppliedJobsContext);
