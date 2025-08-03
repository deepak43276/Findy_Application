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
import { motion, easeOut, Variants } from "framer-motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

export default function PostJob() {
  const { toast } = useToast();
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  // State for form fields
  const initialJobData = {
    title: "",
    company: "",
    location: "",
    jobType: "",
    experienceLevel: "",
    department: "",
    minSalary: "",
    maxSalary: "",
    description: "",
    requirements: "",
    benefits: "",
    applicationEmail: "",
    applicationDeadline: "",
    acceptApplications: true,
    featured: false,
    urgent: false,
    remote: false,
  };
  const [jobData, setJobData] = useState(initialJobData);

  // ✅ Correct Framer Motion variants with type-safe easing
  const pageVariants: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
  };

  const cardStagger: Variants = {
    visible: { transition: { staggerChildren: 0.12 } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  // Handle form submit and store job
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: jobData.title,
      company: jobData.company,
      location: jobData.location,
      type: jobData.jobType, // backend expects "type"
      salary:
        jobData.minSalary && jobData.maxSalary
          ? `${jobData.minSalary}-${jobData.maxSalary}`
          : "",
      description: jobData.description,
      requirements: jobData.requirements,
      benefits: jobData.benefits,
      skills,
      postedAt: new Date().toISOString().slice(0, 19),
      featured: jobData.featured,
      urgent: jobData.urgent,
      remote: jobData.remote,
      applicationEmail: jobData.applicationEmail,
      applicationDeadline: jobData.applicationDeadline
        ? `${jobData.applicationDeadline}T23:59:59`
        : null,
      acceptApplications: jobData.acceptApplications,
      experienceLevel: jobData.experienceLevel,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save job");

      toast({
        title: "Job Posted Successfully!",
        description: "Your job listing has been saved to the database.",
      });

      // Reset form
      setJobData(initialJobData);
      setSkills([]);
    } catch (err) {
      console.error("Error posting job:", err);
      toast({
        title: "Error",
        description: "Failed to post the job. Check console.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: string, value: any) => {
    setJobData((prev) => ({ ...prev, [field]: value }));
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
        <motion.div
          className="max-w-4xl mx-auto"
          variants={cardStagger}
          initial="hidden"
          animate="visible"
        >
          <div className="mb-8">
            <motion.h1
              className="text-4xl font-bold mb-4 gradient-text"
              variants={cardVariants}
            >
              Post a New Job
            </motion.h1>
            <motion.p
              className="text-muted-foreground"
              variants={cardVariants}
            >
              Find the perfect candidate for your team
            </motion.p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <motion.div
                className="lg:col-span-2 space-y-6"
                variants={cardStagger}
              >
                {/* Job Details */}
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
                          value={jobData.title}
                          onChange={(e) => handleChange("title", e.target.value)}
                          placeholder="e.g. Senior Frontend Developer"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="company">Company Name *</Label>
                          <Input
                            id="company"
                            value={jobData.company}
                            onChange={(e) =>
                              handleChange("company", e.target.value)
                            }
                            placeholder="Your company name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location *</Label>
                          <Input
                            id="location"
                            value={jobData.location}
                            onChange={(e) =>
                              handleChange("location", e.target.value)
                            }
                            placeholder="e.g. New York, NY"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Job Type *</Label>
                          <Select
                            value={jobData.jobType}
                            onValueChange={(v) => handleChange("jobType", v)}
                            required
                          >
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
                          <Label>Experience Level *</Label>
                          <Select
                            value={jobData.experienceLevel}
                            onValueChange={(v) =>
                              handleChange("experienceLevel", v)
                            }
                            required
                          >
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
                          <Label>Department</Label>
                          <Select
                            value={jobData.department}
                            onValueChange={(v) => handleChange("department", v)}
                          >
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
                            value={jobData.minSalary}
                            onChange={(e) =>
                              handleChange("minSalary", e.target.value)
                            }
                            placeholder="80000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="maxSalary">Max Salary ($)</Label>
                          <Input
                            id="maxSalary"
                            type="number"
                            value={jobData.maxSalary}
                            onChange={(e) =>
                              handleChange("maxSalary", e.target.value)
                            }
                            placeholder="120000"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Job Description */}
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
                          value={jobData.description}
                          onChange={(e) =>
                            handleChange("description", e.target.value)
                          }
                          placeholder="Describe the role..."
                          className="min-h-32"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="requirements">Requirements</Label>
                        <Textarea
                          id="requirements"
                          value={jobData.requirements}
                          onChange={(e) =>
                            handleChange("requirements", e.target.value)
                          }
                          placeholder="List the required qualifications..."
                          className="min-h-24"
                        />
                      </div>

                      <div>
                        <Label htmlFor="benefits">Benefits & Perks</Label>
                        <Textarea
                          id="benefits"
                          value={jobData.benefits}
                          onChange={(e) =>
                            handleChange("benefits", e.target.value)
                          }
                          placeholder="Describe the benefits..."
                          className="min-h-24"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Skills */}
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
                          onKeyPress={(e) =>
                            e.key === "Enter" && (e.preventDefault(), addSkill())
                          }
                        />
                        <Button
                          type="button"
                          onClick={addSkill}
                          variant="outline"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
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
              <motion.div
                className="lg:col-span-1 space-y-6"
                variants={cardStagger}
              >
                {/* Publishing Options */}
                <motion.div variants={cardVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Publishing Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="featured"
                          checked={jobData.featured}
                          onCheckedChange={(v) =>
                            handleChange("featured", Boolean(v))
                          }
                        />
                        <Label htmlFor="featured">
                          Feature this job (+$50)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="urgent"
                          checked={jobData.urgent}
                          onCheckedChange={(v) =>
                            handleChange("urgent", Boolean(v))
                          }
                        />
                        <Label htmlFor="urgent">
                          Mark as urgent (+$25)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remote"
                          checked={jobData.remote}
                          onCheckedChange={(v) =>
                            handleChange("remote", Boolean(v))
                          }
                        />
                        <Label htmlFor="remote">Remote work available</Label>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Application Settings */}
                <motion.div variants={cardVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Application Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="applicationEmail">
                          Application Email
                        </Label>
                        <Input
                          id="applicationEmail"
                          type="email"
                          value={jobData.applicationEmail}
                          onChange={(e) =>
                            handleChange("applicationEmail", e.target.value)
                          }
                          placeholder="jobs@company.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="applicationDeadline">
                          Application Deadline
                        </Label>
                        <Input
                          id="applicationDeadline"
                          type="date"
                          value={jobData.applicationDeadline}
                          onChange={(e) =>
                            handleChange("applicationDeadline", e.target.value)
                          }
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="acceptApplications"
                          checked={jobData.acceptApplications}
                          onCheckedChange={(v) =>
                            handleChange("acceptApplications", Boolean(v))
                          }
                        />
                        <Label htmlFor="acceptApplications">
                          Accept applications
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Submit */}
                <motion.div variants={cardVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Preview & Publish</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full">
                        Preview Job
                      </Button>
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90"
                      >
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
