import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Mail, Phone, Globe, Plus, Edit, Trash2, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const skills = ["React", "TypeScript", "Node.js", "Python", "AWS", "MongoDB"];
  const certifications = [
    { name: "AWS Solutions Architect", issuer: "Amazon", year: "2023" },
    { name: "React Developer Certification", issuer: "Meta", year: "2022" }
  ];

  const workExperience = [
    {
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      duration: "2022 - Present",
      description: "Lead frontend development for e-commerce platform serving 1M+ users. Built responsive web applications using React and TypeScript."
    },
    {
      title: "Frontend Developer", 
      company: "StartupXYZ",
      duration: "2020 - 2022",
      description: "Developed user interfaces for SaaS platform. Collaborated with design team to implement pixel-perfect designs."
    }
  ];

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="relative inline-block mb-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 rounded-full p-2">
                      <Upload className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-2">John Doe</h2>
                  <p className="text-muted-foreground mb-4">Senior Frontend Developer</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      New York, NY
                    </div>
                    <div className="flex items-center justify-center">
                      <Mail className="w-4 h-4 mr-2" />
                      john.doe@email.com
                    </div>
                    <div className="flex items-center justify-center">
                      <Phone className="w-4 h-4 mr-2" />
                      +1 (555) 123-4567
                    </div>
                    <div className="flex items-center justify-center">
                      <Globe className="w-4 h-4 mr-2" />
                      johndoe.dev
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <Button 
                      className="w-full" 
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {isEditing ? "Cancel Edit" : "Edit Profile"}
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        <Plus className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="certifications">Certifications</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        About Me
                        {isEditing && (
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <Textarea 
                          placeholder="Tell us about yourself..."
                          className="min-h-32"
                          defaultValue="Passionate frontend developer with 5+ years of experience building scalable web applications. Specialized in React ecosystem and modern JavaScript frameworks. Love creating user-friendly interfaces that solve real-world problems."
                        />
                      ) : (
                        <p className="text-muted-foreground">
                          Passionate frontend developer with 5+ years of experience building scalable web applications. 
                          Specialized in React ecosystem and modern JavaScript frameworks. Love creating user-friendly 
                          interfaces that solve real-world problems.
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">5+</div>
                          <div className="text-sm text-muted-foreground">Years Experience</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">20+</div>
                          <div className="text-sm text-muted-foreground">Projects Completed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">15</div>
                          <div className="text-sm text-muted-foreground">Skills Mastered</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">3</div>
                          <div className="text-sm text-muted-foreground">Certifications</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="experience" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Work Experience</h3>
                    {isEditing && (
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Experience
                      </Button>
                    )}
                  </div>

                  {workExperience.map((exp, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-lg font-semibold">{exp.title}</h4>
                            <p className="text-primary font-medium">{exp.company}</p>
                            <div className="flex items-center text-muted-foreground text-sm mt-1">
                              <Calendar className="w-4 h-4 mr-1" />
                              {exp.duration}
                            </div>
                          </div>
                          {isEditing && (
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <p className="text-muted-foreground mt-3">{exp.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="certifications" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Certifications</h3>
                    {isEditing && (
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Certification
                      </Button>
                    )}
                  </div>

                  {certifications.map((cert, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-lg font-semibold">{cert.name}</h4>
                            <p className="text-primary font-medium">{cert.issuer}</p>
                            <p className="text-muted-foreground text-sm">{cert.year}</p>
                          </div>
                          {isEditing && (
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" defaultValue="John" />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" defaultValue="Doe" />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="john.doe@email.com" />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" defaultValue="+1 (555) 123-4567" />
                      </div>

                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" defaultValue="New York, NY" />
                      </div>

                      <div>
                        <Label htmlFor="jobTitle">Current Job Title</Label>
                        <Input id="jobTitle" defaultValue="Senior Frontend Developer" />
                      </div>

                      <div>
                        <Label htmlFor="experienceLevel">Experience Level</Label>
                        <Select defaultValue="senior">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="entry">Entry Level</SelectItem>
                            <SelectItem value="mid">Mid Level</SelectItem>
                            <SelectItem value="senior">Senior Level</SelectItem>
                            <SelectItem value="executive">Executive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button onClick={handleSave} className="w-full">
                        Save Changes
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 