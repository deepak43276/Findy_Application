"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return; // Wait for user

    async function fetchSavedJobs() {
      try {
        setLoading(true);
        const savedRes = await fetch(`http://localhost:8081/api/saved-jobs/${userId}`);
        if (!savedRes.ok) throw new Error("Failed to fetch saved jobs");

        const savedData = await savedRes.json();
        const jobIds = savedData.map((item: any) => item.jobId);

        if (jobIds.length === 0) {
          setJobs([]);
          setLoading(false);
          return;
        }

        // Fetch each job by ID (or optimize with batch API)
        const jobsData = await Promise.all(
          jobIds.map((id: number) =>
            fetch(`http://localhost:8081/api/jobs/${id}`).then((res) => res.json())
          )
        );

        setJobs(jobsData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Error fetching saved jobs");
        setLoading(false);
      }
    }

    fetchSavedJobs();
  }, [userId]);

  if (!userId) return <div className="p-6">Please login to see saved jobs.</div>;
  if (loading) return <div className="p-6">Loading saved jobs...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Saved Jobs</h1>
      {jobs.length === 0 ? (
        <p>No saved jobs yet.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="p-4 border rounded">
              <h3 className="font-semibold">{job.title}</h3>
              <p>{job.company} - {job.location}</p>
              <p className="text-primary">{job.salary}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
