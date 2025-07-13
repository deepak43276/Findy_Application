import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Briefcase, Heart, MessageCircle, Star } from "lucide-react";

interface Candidate {
  id: number;
  name: string;
  title: string;
  location: string;
  experience: string;
  rate: string;
  rating: number;
  skills: string[];
  avatar: string;
  available: boolean;
  description: string;
}

export default function FindTalent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const candidates: Candidate[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Senior UX Designer",
      location: "San Francisco, CA",
      experience: "6 years",
      rate: "$85/hour",
      rating: 4.9,
      skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
      avatar: "/placeholder.svg",
      available: true,
      description: "Passionate UX designer with expertise in creating user-centered digital experiences..."
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Full Stack Developer",
      location: "New York, NY",
      experience: "8 years",
      rate: "$95/hour",
      rating: 4.8,
      skills: ["React", "Node.js", "Python", "AWS"],
      avatar: "/placeholder.svg",
      available: true,
      description: "Full stack developer specializing in modern web applications and cloud infrastructure..."
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      title: "Digital Marketing Specialist",
      location: "Austin, TX",
      experience: "4 years",
      rate: "$65/hour",
      rating: 4.7,
      skills: ["SEO", "Google Ads", "Content Marketing", "Analytics"],
      avatar: "/placeholder.svg",
      available: false,
      description: "Results-driven digital marketer with proven track record of increasing online visibility..."
    },
    {
      id: 4,
      name: "David Kim",
      title: "Data Scientist",
      location: "Seattle, WA",
      experience: "5 years",
      rate: "$105/hour",
      rating: 4.9,
      skills: ["Python", "Machine Learning", "SQL", "Tableau"],
      avatar: "/placeholder.svg",
      available: true,
      description: "Data scientist passionate about turning complex data into actionable business insights..."
    }
  ];

  const skills = ["React", "Python", "Design", "Marketing", "Data Science", "Node.js", "AWS", "Figma"];
  const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Expert"];
  const hourlyRates = ["$0-50", "$50-100", "$100-150", "$150+"];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Find Top Talent</h1>
          <p className="text-muted-foreground mb-6">Connect with skilled professionals for your projects</p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Skills, job title, or keywords"
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
              Search Talent
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Skills</h3>
                  <div className="space-y-2">
                    {skills.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox id={skill} />
                        <label htmlFor={skill} className="text-sm">{skill}</label>
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
                  <h3 className="font-medium mb-3">Hourly Rate</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      {hourlyRates.map((rate) => (
                        <SelectItem key={rate} value={rate}>
                          {rate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Availability</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="available" />
                      <label htmlFor="available" className="text-sm">Available now</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="soon" />
                      <label htmlFor="soon" className="text-sm">Available soon</label>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Talent Listings */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Talent Results</h2>
              <Select defaultValue="rating">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="rate-low">Rate: Low to High</SelectItem>
                  <SelectItem value="rate-high">Rate: High to Low</SelectItem>
                  <SelectItem value="experience">Most Experience</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-6">
              {candidates.map((candidate) => (
                <Card key={candidate.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={candidate.avatar} />
                          <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-xl font-semibold">{candidate.name}</h3>
                            {candidate.available && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                Available
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-primary font-medium mb-2">{candidate.title}</p>
                          
                          <div className="flex items-center text-muted-foreground text-sm mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="mr-4">{candidate.location}</span>
                            <Briefcase className="w-4 h-4 mr-1" />
                            <span>{candidate.experience} experience</span>
                          </div>
                          
                          <div className="flex items-center mb-3">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm font-medium mr-2">{candidate.rating}</span>
                            <span className="text-lg font-bold text-primary">{candidate.rate}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>

                    <p className="text-muted-foreground mb-4">{candidate.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {candidate.skills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button variant="outline">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button>
                          View Profile
                        </Button>
                      </div>
                      <Button className="bg-primary hover:bg-primary/90">
                        Hire Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 