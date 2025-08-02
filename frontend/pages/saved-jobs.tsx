"use client";

import { useSavedJobs } from "@/context/SavedJobsContext";
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Briefcase, MapPin, Clock } from "lucide-react";
import { motion, easeOut } from "framer-motion";

export default function SavedJobsPage() {
  const { savedJobDetails, savedJobs, toggleSaveJob, loading } = useSavedJobs();

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
        <h1 className="text-4xl font-bold mb-8 gradient-text">Your Saved Jobs</h1>

        {loading ? (
          <div className="text-center text-muted-foreground py-12">Loading saved jobs...</div>
        ) : savedJobDetails.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            You haven’t saved any jobs yet.
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            {savedJobDetails.map((job) => {
              const isSaved = savedJobs.includes(job.id);

              return (
                <motion.div key={job.id} variants={cardVariants}>
                  <Card className="hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                          <div className="text-sm text-muted-foreground mb-1">
                            <span className="font-semibold">Experience Level:</span>{" "}
                            {job.experienceLevel ?? "N/A"}
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
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSaveJob(job.id)}
                        >
                          <Heart className={`w-4 h-4 ${isSaved ? "text-red-500 fill-red-500" : ""}`} />
                        </Button>
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
                        <div className="space-x-2">
                          <Button
                            variant={isSaved ? "default" : "outline"}
                            onClick={() => toggleSaveJob(job.id)}
                          >
                            {isSaved ? "Unsave" : "Save"}
                          </Button>
                          <Button className="bg-primary hover:bg-primary/90">Apply Now</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function formatSalaryLPA(salary: string): string {
  const match = salary.match(/(\d+)[kK]? *- *(\d+)[kK]?/);
  if (match) {
    const min = parseInt(match[1], 10);
    const max = parseInt(match[2], 10);
    return `${min / 100} LPA - ${max / 100} LPA`;
  }
  return salary;
}
