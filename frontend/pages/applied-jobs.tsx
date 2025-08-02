"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock } from "lucide-react";
import { motion, easeOut } from "framer-motion";
import { useAppliedJobs } from "@/context/AppliedJobsContext";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  skills: string[];
  description: string;
  experienceLevel?: string;
}

export default function AppliedJobsPage() {
  const { appliedJobs, toggleApplyJob } = useAppliedJobs();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (appliedJobs.length === 0) {
      setLoading(false);
      return;
    }

    // Fetch only applied jobs
    fetch("http://localhost:8081/api/jobs")
      .then((res) => res.json())
      .then((data: Job[]) => {
        const filtered = data.filter((job) => appliedJobs.includes(job.id));
        setJobs(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [appliedJobs]);

  const pageVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants} className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 gradient-text">Applied Jobs</h1>

        {loading ? (
          <div className="text-center text-muted-foreground py-12">Loading applied jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">No applied jobs yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <motion.div key={job.id} variants={cardVariants} initial="hidden" animate="visible">
                <Card className="hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                    <div className="text-sm text-muted-foreground mb-1">
                      <span className="font-semibold">Experience Level:</span> {job.experienceLevel ?? "N/A"}
                    </div>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <Briefcase className="w-4 h-4 mr-2" />
                      <span className="mr-4">{job.company}</span>
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground mb-3">
                      <span className="mr-4">{job.type}</span>
                      <span className="font-medium text-primary">{formatSalaryLPA(job.salary)}</span>
                    </div>

                    <p className="text-muted-foreground mb-4">{job.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" /> {job.posted}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => toggleApplyJob(job.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function formatSalaryLPA(salary: string): string {
  const match = salary.match(/(\d+)[kK]? *- *(\d+)[kK]?/);
  return match ? `${parseInt(match[1], 10) / 100} LPA - ${parseInt(match[2], 10) / 100} LPA` : salary;
}
