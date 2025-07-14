import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function PostJob() {
  const { toast } = useToast();
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Job Posted Successfully!",
      description: "Your job listing has been published and is now live.",
    });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="min-h-screen bg-background"
    >
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div className="max-w-4xl mx-auto" variants={cardStagger} initial="hidden" animate="visible">
          <div className="mb-8">
            <motion.h1 className="text-4xl font-bold mb-4 gradient-text" variants={cardVariants}>Post a New Job</motion.h1>
            <motion.p className="text-muted-foreground" variants={cardVariants}>Find the perfect candidate for your team</motion.p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <motion.div className="lg:col-span-2 space-y-6" variants={cardStagger}>
                <motion.div variants={cardVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Job Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="jobTitle">Job Title *</Label>
                        <Input 
                          id="jobTitle" 
                          placeholder="e.g. Senior Frontend Developer"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="company">Company Name *</Label>
                          <Input 
                            id="company" 
                            placeholder="Your company name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location *</Label>
                          <Input 
                            id="location" 
                            placeholder="e.g. New York, NY"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="jobType">Job Type *</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="full-time">Full-time</SelectItem>
                              <SelectItem value="part-time">Part-time</SelectItem>
                              <SelectItem value="contract">Contract</SelectItem>
                              <SelectItem value="remote">Remote</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="experience">Experience Level *</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="entry">Entry Level</SelectItem>
                              <SelectItem value="mid">Mid Level</SelectItem>
                              <SelectItem value="senior">Senior Level</SelectItem>
                              <SelectItem value="executive">Executive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="department">Department</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="engineering">Engineering</SelectItem>
                              <SelectItem value="design">Design</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="sales">Sales</SelectItem>
                              <SelectItem value="hr">Human Resources</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="minSalary">Min Salary ($)</Label>
                          <Input 
                            id="minSalary" 
                            type="number"
                            placeholder="80000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="maxSalary">Max Salary ($)</Label>
                          <Input 
                            id="maxSalary" 
                            type="number"
                            placeholder="120000"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={cardVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Job Description</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="description">Job Description *</Label>
                        <Textarea 
                          id="description"
                          placeholder="Describe the role, responsibilities, and what you're looking for..."
                          className="min-h-32"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="requirements">Requirements</Label>
                        <Textarea 
                          id="requirements"
                          placeholder="List the required qualifications, experience, and skills..."
                          className="min-h-24"
                        />
                      </div>

                      <div>
                        <Label htmlFor="benefits">Benefits & Perks</Label>
                        <Textarea 
                          id="benefits"
                          placeholder="Describe the benefits, perks, and what makes your company great..."
                          className="min-h-24"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={cardVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Required Skills</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a skill"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        />
                        <Button type="button" onClick={addSkill} variant="outline">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="ml-1 hover:bg-muted rounded-full p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Sidebar */}
              <motion.div className="lg:col-span-1 space-y-6" variants={cardStagger}>
                <motion.div variants={cardVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Publishing Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="featured" />
                        <Label htmlFor="featured">Feature this job (+$50)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="urgent" />
                        <Label htmlFor="urgent">Mark as urgent (+$25)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remote" />
                        <Label htmlFor="remote">Remote work available</Label>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={cardVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Application Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="applicationEmail">Application Email</Label>
                        <Input 
                          id="applicationEmail" 
                          type="email"
                          placeholder="jobs@company.com"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="applicationDeadline">Application Deadline</Label>
                        <Input 
                          id="applicationDeadline" 
                          type="date"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="acceptApplications" defaultChecked />
                        <Label htmlFor="acceptApplications">Accept applications</Label>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={cardVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Preview & Publish</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full">
                        Preview Job
                      </Button>
                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                        Publish Job
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        By posting this job, you agree to our Terms of Service
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
} 