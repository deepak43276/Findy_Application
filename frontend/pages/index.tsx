import { useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Briefcase, Users, TrendingUp, Star, ArrowRight } from "lucide-react";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const featuredJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "New York, NY",
      type: "Full-time",
      salary: "$120k - $160k",
      skills: ["React", "TypeScript", "Next.js"],
      featured: true
    },
    {
      id: 2,
      title: "UX/UI Designer",
      company: "Design Studio",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$100k - $140k",
      skills: ["Figma", "Adobe XD", "Prototyping"],
      featured: true
    },
    {
      id: 3,
      title: "Backend Developer",
      company: "StartupXYZ",
      location: "Austin, TX",
      type: "Contract",
      salary: "$90k - $120k",
      skills: ["Node.js", "PostgreSQL", "AWS"],
      featured: false
    }
  ];

  const stats = [
    { label: "Active Jobs", value: "2,500+", icon: Briefcase },
    { label: "Companies", value: "500+", icon: Users },
    { label: "Success Rate", value: "95%", icon: TrendingUp },
    { label: "User Rating", value: "4.8/5", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
              Find Your Dream Job
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with top companies and discover opportunities that match your skills and aspirations
            </p>
            
            {/* Search Bar */}
            <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Job title, keywords, or company"
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Location"
                    value={location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button className="bg-primary hover:bg-primary/90 px-8">
                  Search Jobs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Jobs</h2>
              <p className="text-muted-foreground">Hand-picked opportunities from top companies</p>
            </div>
            <Link href="/find-jobs">
              <Button variant="outline" className="flex items-center gap-2">
                View All Jobs
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
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
                    {job.featured && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Post a Job?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find the perfect candidate for your team. Post your job listing and connect with talented professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/post-job">
              <Button className="bg-primary hover:bg-primary/90 px-8">
                Post a Job
              </Button>
            </Link>
            <Link href="/find-talent">
              <Button variant="outline" className="px-8">
                Find Talent
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 