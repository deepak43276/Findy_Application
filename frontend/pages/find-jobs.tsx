import { useState, useEffect } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Clock, Briefcase, Building, Heart } from "lucide-react";

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
}

export default function FindJobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobListings, setJobListings] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, this would come from API
  const mockJobListings: Job[] = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "New York, NY",
      type: "Full-time",
      salary: "$120k - $160k",
      posted: "2 days ago",
      skills: ["React", "TypeScript", "Next.js"],
      description: "We're looking for an experienced frontend developer to join our team..."
    },
    {
      id: 2,
      title: "UX/UI Designer",
      company: "Design Studio",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$100k - $140k",
      posted: "1 day ago",
      skills: ["Figma", "Adobe XD", "Prototyping"],
      description: "Join our creative team to design beautiful user experiences..."
    },
    {
      id: 3,
      title: "Backend Developer",
      company: "StartupXYZ",
      location: "Austin, TX",
      type: "Contract",
      salary: "$90k - $120k",
      posted: "3 days ago",
      skills: ["Node.js", "PostgreSQL", "AWS"],
      description: "Looking for a backend developer to build scalable systems..."
    },
    {
      id: 4,
      title: "Data Scientist",
      company: "Analytics Co",
      location: "Remote",
      type: "Full-time",
      salary: "$130k - $170k",
      posted: "1 week ago",
      skills: ["Python", "Machine Learning", "SQL"],
      description: "Analyze complex datasets to drive business insights..."
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setJobListings(mockJobListings);
      setLoading(false);
    }, 1000);
  }, []);

  const jobTypes = ["Full-time", "Part-time", "Contract", "Remote"];
  const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Executive"];
  const salaryRanges = ["$0 - $50k", "$50k - $100k", "$100k - $150k", "$150k+"];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 mb-8">
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
        </div>

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
                        <Checkbox id={type} />
                        <label htmlFor={type} className="text-sm">{type}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Experience Level</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level} value={level.toLowerCase().replace(" ", "-")}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Salary Range</h3>
                  <Select>
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

                <Button variant="outline" className="w-full">
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Job Results</h2>
              <Select defaultValue="recent">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="relevant">Most Relevant</SelectItem>
                  <SelectItem value="salary-high">Salary: High to Low</SelectItem>
                  <SelectItem value="salary-low">Salary: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-muted rounded mb-4"></div>
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded mb-4"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {jobListings.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                          <div className="flex items-center text-muted-foreground mb-2">
                            <Building className="w-4 h-4 mr-2" />
                            <span className="mr-4">{job.company}</span>
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center text-muted-foreground mb-3">
                            <Briefcase className="w-4 h-4 mr-2" />
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 