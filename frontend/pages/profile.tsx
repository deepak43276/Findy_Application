"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Mail, Phone, Globe, Edit, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Profile() {
  const { toast } = useToast();
  const { logout, token } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ===== Fetch current user =====
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:8081/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          toast({ title: "Session expired", description: "Please log in again.", variant: "destructive" });
          logout();
          router.push("/login");
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch user info");

        const data = await res.json();
        setUserData(data);
      } catch (err: any) {
        setError(err.message || "Error fetching user info");
        toast({ title: "Error", description: err.message || "Error fetching user info", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, logout, router, toast]);

  // ===== Handle input change =====
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUserData({ ...userData, [e.target.id]: e.target.value });
  };

  // ===== Save profile changes =====
  const handleSave = async () => {
    setIsEditing(false);
    setSaveLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`http://localhost:8081/api/users/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (res.status === 401) {
        toast({ title: "Session expired", description: "Please log in again.", variant: "destructive" });
        logout();
        router.push("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to update profile");

      setSuccess("Profile updated successfully");
      toast({ title: "Success", description: "Profile updated successfully." });
    } catch (err: any) {
      setError(err.message || "Error updating profile");
      toast({ title: "Error", description: err.message || "Error updating profile", variant: "destructive" });
    } finally {
      setSaveLoading(false);
    }
  };

  // ===== Animations =====
  const pageVariants = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } };
  const cardStagger = { visible: { transition: { staggerChildren: 0.12 } } };
  const cardVariants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };

  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants} className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div>Loading profile...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : userData ? (
          <motion.div className="max-w-6xl mx-auto" variants={cardStagger} initial="hidden" animate="visible">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Sidebar */}
              <motion.div className="lg:col-span-1 space-y-6" variants={cardStagger}>
                <motion.div variants={cardVariants}>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="relative inline-block mb-4">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>{userData.firstName?.[0]}{userData.lastName?.[0]}</AvatarFallback>
                        </Avatar>
                        <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 rounded-full p-2">
                          <Upload className="w-3 h-3" />
                        </Button>
                      </div>
                      <h2 className="text-2xl font-bold mb-2">{userData.firstName} {userData.lastName}</h2>
                      <p className="text-muted-foreground mb-4">{userData.jobTitle || "No job title"}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-center"><MapPin className="w-4 h-4 mr-2" />{userData.location || "No location"}</div>
                        <div className="flex items-center justify-center"><Mail className="w-4 h-4 mr-2" />{userData.email}</div>
                        <div className="flex items-center justify-center"><Phone className="w-4 h-4 mr-2" />{userData.phone || "No phone"}</div>
                        <div className="flex items-center justify-center"><Globe className="w-4 h-4 mr-2" />{userData.website || "No website"}</div>
                      </div>
                      <div className="mt-6 space-y-2">
                        <Button className="w-full" onClick={() => setIsEditing(!isEditing)}>
                          <Edit className="w-4 h-4 mr-2" />
                          {isEditing ? "Cancel Edit" : "Edit Profile"}
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download Resume
                        </Button>
                        <Button variant="destructive" className="w-full" onClick={() => { logout(); router.push("/login"); }}>
                          Logout
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={cardVariants}>
                  <Card>
                    <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {userData.skills && userData.skills.length > 0
                          ? userData.skills.map((skill: string) => <Badge key={skill} variant="secondary">{skill}</Badge>)
                          : <span className="text-muted-foreground">No skills</span>}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Main Content */}
              <motion.div className="lg:col-span-2" variants={cardStagger}>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="certifications">Certifications</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-6">
                    <motion.div variants={cardVariants}>
                      <Card>
                        <CardHeader>
                          <CardTitle>About Me</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {isEditing ? (
                            <Textarea id="about" className="min-h-32" value={userData.about || ""} onChange={handleInputChange} />
                          ) : (
                            <p className="text-muted-foreground">{userData.about || "No about info"}</p>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>

                  {/* Settings Tab */}
                  <TabsContent value="settings" className="space-y-6">
                    <motion.div variants={cardVariants}>
                      <Card>
                        <CardHeader><CardTitle>Profile Settings</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div><Label htmlFor="firstName">First Name</Label><Input id="firstName" value={userData.firstName || ""} onChange={handleInputChange} disabled={!isEditing} /></div>
                            <div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" value={userData.lastName || ""} onChange={handleInputChange} disabled={!isEditing} /></div>
                          </div>
                          <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={userData.email || ""} disabled /></div>
                          <div><Label htmlFor="phone">Phone</Label><Input id="phone" value={userData.phone || ""} onChange={handleInputChange} disabled={!isEditing} /></div>
                          <div><Label htmlFor="location">Location</Label><Input id="location" value={userData.location || ""} onChange={handleInputChange} disabled={!isEditing} /></div>
                          <div><Label htmlFor="jobTitle">Job Title</Label><Input id="jobTitle" value={userData.jobTitle || ""} onChange={handleInputChange} disabled={!isEditing} /></div>
                          <div><Label htmlFor="experienceLevel">Experience Level</Label><Input id="experienceLevel" value={userData.experienceLevel || ""} onChange={handleInputChange} disabled={!isEditing} /></div>
                          <div><Label htmlFor="website">Website</Label><Input id="website" value={userData.website || ""} onChange={handleInputChange} disabled={!isEditing} /></div>
                          <div><Label htmlFor="about">About</Label><Textarea id="about" value={userData.about || ""} onChange={handleInputChange} disabled={!isEditing} /></div>

                          {isEditing && (
                            <Button onClick={handleSave} className="w-full" disabled={saveLoading}>
                              {saveLoading ? "Saving..." : "Save Changes"}
                            </Button>
                          )}
                          {success && <div className="text-green-600 text-sm">{success}</div>}
                          {error && <div className="text-red-500 text-sm">{error}</div>}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
}
