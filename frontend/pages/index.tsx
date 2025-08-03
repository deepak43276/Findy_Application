import { useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Briefcase, Users, TrendingUp, Star } from "lucide-react";
import { motion, easeOut } from "framer-motion";

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

  // ✅ Correct Framer Motion variants with easeOut function
  const pageVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } }
  };
  const heroVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } }
  };
  const cardStagger = {
    visible: { transition: { staggerChildren: 0.15 } }
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="min-h-screen bg-background"
    >
      <Navigation />

      {/* Hero Section */}
      <motion.section
        className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <div className="container mx-auto px-4 py-20">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: easeOut }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
              Find Your Dream Job
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with top companies and discover opportunities that match your skills and aspirations
            </p>

            {/* Search Bar */}
            <motion.div
              className="bg-background/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: easeOut }}
            >
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
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Jobs Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center gradient-text">Featured Jobs</h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={cardStagger}
            initial="hidden"
            animate="visible"
          >
            {featuredJobs.map((job) => (
              <motion.div key={job.id} variants={cardVariants}>
                <Card className="hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>{job.company} &mdash; {job.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {job.skills.map(skill => (
                        <Badge key={skill}>{skill}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{job.type}</span>
                      <span>{job.salary}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardStagger}
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={cardVariants}>
                <div className="flex flex-col items-center justify-center p-6 bg-background rounded-xl shadow-md">
                  <stat.icon className="w-8 h-8 text-primary mb-2" />
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            Ready to Post a Job?
          </motion.h2>
          <motion.p
            className="text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
          >
            Find the perfect candidate for your team. Post your job listing and connect with talented professionals.
          </motion.p>
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
    </motion.div>
  );
}
