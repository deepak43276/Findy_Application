import { useState, useEffect } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Star } from "lucide-react";
import { motion, easeOut } from "framer-motion";

interface Candidate {
  id: number;
  name: string;
  title: string;
  location: string;
  experience: string;
  experienceLevel?: string;
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
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string | undefined>(undefined);
  const [selectedRate, setSelectedRate] = useState<string | undefined>(undefined);
  const [sortOption, setSortOption] = useState("rating");

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("http://localhost:8081/api/candidates")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch candidates");
        const data = await res.json();
        setCandidates(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error fetching candidates");
        setLoading(false);
      });
  }, []);

  const skills = ["React", "Python", "Design", "Marketing", "Data Science", "Node.js", "AWS", "Figma"];
  const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Expert"];
  const hourlyRates = ["0 LPA - 4 LPA", "4 LPA - 8 LPA", "8 LPA - 12 LPA", "12 LPA+"];

  const pageVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
  };
  const cardStagger = { visible: { transition: { staggerChildren: 0.12 } } };
  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
  };

  // ✅ Parse salary (single or range)
  function parseRate(rateStr: string): [number | null, number | null] {
    const rangeMatch = rateStr.match(/(\d+)\s*[lL][pP][aA]?\s*-\s*(\d+)\s*[lL][pP][aA]?/);
    const singleMatch = rateStr.match(/(\d+)\s*[lL][pP][aA]?/);

    if (rangeMatch) {
      return [parseInt(rangeMatch[1], 10) * 100000, parseInt(rangeMatch[2], 10) * 100000];
    } else if (singleMatch) {
      const value = parseInt(singleMatch[1], 10) * 100000;
      return [value, value];
    }
    return [null, null];
  }

  function parseFilterRate(rangeStr: string): [number | null, number | null] {
    const match = rangeStr.match(/(\d+)\s*[lL][pP][aA]?\s*-\s*(\d+)\s*[lL][pP][aA]?/);
    if (!match) return [null, null];
    return [parseInt(match[1], 10) * 100000, parseInt(match[2], 10) * 100000];
  }

  // ✅ Filter candidates
  const filteredCandidates = candidates.filter((candidate) => {
    let matches = true;

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      matches =
        matches &&
        (candidate.name.toLowerCase().includes(q) ||
          candidate.title.toLowerCase().includes(q) ||
          (candidate.description && candidate.description.toLowerCase().includes(q)));
    }

    // Location
    if (location) matches = matches && candidate.location.toLowerCase().includes(location.toLowerCase());

    // Skills
    if (selectedSkills.length > 0 && candidate.skills.length > 0) {
      matches =
        matches &&
        selectedSkills.some((skill) =>
          candidate.skills.some((s) => s.toLowerCase() === skill.toLowerCase())
        );
    }

    // Experience
    if (selectedExperience) matches = matches && candidate.experienceLevel === selectedExperience;

    // Salary Range
    if (selectedRate && candidate.rate) {
      const [candMin, candMax] = parseRate(candidate.rate);
      const [filterMin, filterMax] = parseFilterRate(selectedRate);

      if (candMin === null || candMax === null) return false;
      if (filterMin === null || filterMax === null) return true;

      matches = matches && candMax >= filterMin && candMin <= filterMax;
    }

    return matches;
  });

  // ✅ Sorting Logic
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    const [aMin, aMax] = parseRate(a.rate);
    const [bMin, bMax] = parseRate(b.rate);

    switch (sortOption) {
      case "rate-low":
        return (aMin || 0) - (bMin || 0);
      case "rate-high":
        return (bMax || 0) - (aMax || 0);
      case "experience":
        const expA = parseInt(a.experience) || 0;
        const expB = parseInt(b.experience) || 0;
        return expB - expA;
      case "rating":
      default:
        return (b.rating || 0) - (a.rating || 0);
    }
  });

  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants} className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Skills Filter */}
              <div>
                <h3 className="font-medium mb-3">Skills</h3>
                <div className="space-y-2">
                  {skills.map((skill) => {
                    const normalizedSkill = skill.toLowerCase();
                    return (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={selectedSkills.includes(normalizedSkill)}
                          onCheckedChange={(checked) => {
                            setSelectedSkills((prev) =>
                              checked
                                ? [...prev, normalizedSkill]
                                : prev.filter((s) => s !== normalizedSkill)
                            );
                          }}
                        />
                        <label htmlFor={skill} className="text-sm">
                          {skill}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Experience Filter */}
              <div>
                <h3 className="font-medium mb-3">Experience Level</h3>
                <Select value={selectedExperience} onValueChange={setSelectedExperience}>
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

              {/* Rate Filter */}
              <div>
                <h3 className="font-medium mb-3">Salary Range</h3>
                <Select value={selectedRate} onValueChange={setSelectedRate}>
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

              {/* Clear Filters */}
              <div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchQuery("");
                    setLocation("");
                    setSelectedSkills([]);
                    setSelectedExperience(undefined);
                    setSelectedRate(undefined);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Talent Listings */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Talent Results</h2>
            <Select value={sortOption} onValueChange={setSortOption}>
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

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={cardStagger}
            initial="hidden"
            animate="visible"
          >
            {sortedCandidates.map((candidate) => (
              <motion.div key={candidate.id} variants={cardVariants}>
                <Card className="hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar>
                        <AvatarImage src={candidate.avatar} />
                        <AvatarFallback>{candidate.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">{candidate.name}</h3>
                        <div className="text-muted-foreground text-sm">{candidate.title}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{candidate.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {candidate.skills.map((skill) => (
                        <Badge key={skill}>{skill}</Badge>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm mb-2 text-muted-foreground">
                      <span>Experience: {candidate.experienceLevel || candidate.experience}</span>
                      <span>Package: {candidate.rate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-500 mb-2">
                      {[...Array(Math.max(0, Math.round(Number(candidate.rating) || 0)))].map((_, i) => (
                        <Star key={i} className="w-4 h-4" />
                      ))}
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">{candidate.description}</p>
                    <Button className="w-full bg-primary hover:bg-primary/90">Contact</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
