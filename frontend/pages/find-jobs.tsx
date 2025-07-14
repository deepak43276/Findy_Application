import { useState, useEffect } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Briefcase, Clock, Building, Heart } from "lucide-react";
import { motion, easeOut } from "framer-motion";

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
  requirements?: string;
  experienceLevel?: string;
}

export default function FindJobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState<string | undefined>(undefined);
  const [jobListings, setJobListings] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<string | undefined>(undefined);
  const [salaryRange, setSalaryRange] = useState<string | undefined>(undefined);

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } }
  };
  const cardStagger = {
    visible: {
      transition: {
        staggerChildren: 0.12
      }
    }
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Build query params
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (location) params.append("location", location);
    if (jobType && jobType !== "undefined") params.append("type", jobType);
    if (experienceLevel) params.append("experienceLevel", experienceLevel);
    const url = `http://localhost:8081/api/jobs${params.toString() ? `?${params.toString()}` : ""}`;
    fetch(url)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobListings(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error fetching jobs");
        setLoading(false);
      });
  }, [searchQuery, location, jobType, experienceLevel]);

  const jobTypes = ["Full-time", "Part-time", "Contract", "Remote"];
  const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Executive"];
  const salaryRanges = ["$0 - $50k", "$50k - $100k", "$100k - $150k", "$150k+"];

  // Only apply salaryRange filter on frontend; experienceLevel is handled by backend
  const filteredJobs = jobListings.filter((job) => {
    let matches = true;
    if (salaryRange) {
      matches = matches && !!(job.salary && job.salary.includes(salaryRange.replace(/\$/g, '')));
    }
    return matches;
  });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="min-h-screen bg-background"
    >
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <motion.div
          className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 mb-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-4xl font-bold mb-4 gradient-text">Find Your Dream Job</h1>
          <p className="text-muted-foreground mb-6">Discover thousands of job opportunities</p>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Job title, keywords, or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="bg-primary hover:bg-primary/90 px-8">
              Search Jobs
            </Button>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Job Type</h3>
                  <div className="space-y-2">
                    {jobTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={jobType === type}
                          onCheckedChange={(checked) => setJobType(checked ? type : undefined)}
                        />
                        <label htmlFor={type} className="text-sm">{type}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Experience Level</h3>
                  <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Salary Range</h3>
                  <Select value={salaryRange} onValueChange={setSalaryRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      {salaryRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" className="w-full" onClick={() => {
                  setSearchQuery("");
                  setLocation("");
                  setJobType(undefined);
                  setExperienceLevel(undefined);
                  setSalaryRange(undefined);
                }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>
          {/* Job Listings */}
          <div className="lg:col-span-3">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={cardStagger}
              initial="hidden"
              animate="visible"
            >
              {loading ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">Loading jobs...</div>
              ) : error ? (
                <div className="col-span-full text-center py-12 text-red-500">{error}</div>
              ) : filteredJobs.length === 0 ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">No jobs found.</div>
              ) : (
                filteredJobs.map((job) => (
                  <motion.div key={job.id} variants={cardVariants}>
                    <Card className="hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
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
                              <span className="font-medium text-primary">{job.salary}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-muted-foreground mb-4">{job.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 mr-1" />
                            {job.posted}
                          </div>
                          <div className="space-x-2">
                            <Button variant="outline">Save</Button>
                            <Button className="bg-primary hover:bg-primary/90">Apply Now</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 