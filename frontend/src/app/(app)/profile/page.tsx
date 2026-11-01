"use client";

import { useEffect, useState } from "react";
import { axiosAPI } from "@/lib/axiosInterface";
import { useRouter } from "next/navigation";
import { 
  User, Briefcase, GraduationCap, List, Trophy, Save, 
  ArrowLeft, Plus, X, Sparkles, CheckCircle2, ChevronRight, FileText, Terminal
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { ProfilePageSkeleton } from "@/components/skeletons";

interface ExperienceItem {
  title: string;
  company: string;
  location: string;
  duration: string;
  points: string[];
}

interface ProjectItem {
  name: string;
  tech: string[];
  description: string;
}

interface EducationItem {
  degree: string;
  school: string;
  year: string;
}

interface AchievementItem {
  title: string;
  description: string;
  date: string;
}

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  portfolio: string;
  skills: string[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  achievements: AchievementItem[];
}

const initialProfile: ProfileData = {
  fullName: "",
  email: "",
  phone: "",
  github: "",
  linkedin: "",
  portfolio: "",
  skills: [],
  experience: [],
  projects: [],
  education: [],
  achievements: [],
};

export default function ProfileBuilder() {
  const [profileData, setProfileData] = useState<ProfileData>(initialProfile);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "experience" | "skills" | "achievements">("personal");
  const [newSkill, setNewSkill] = useState("");
  
  // Resume Import Modal State
  const [showImportModal, setShowImportModal] = useState(false);
  const [userResumes, setUserResumes] = useState<Array<{ id: string; title: string; createdAt: string }>>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [importing, setImporting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosAPI.get("/profile");
      if (response.data.profile) {
        setProfileData(response.data.profile);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Fresh profile
      } else {
        toast.error("Failed to load profile details.");
        console.error("Error loading profile:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profileData.fullName || !profileData.email) {
      toast.error("Full Name and Email are required fields.");
      setActiveTab("personal");
      return;
    }

    try {
      setIsSaving(true);
      await axiosAPI.post("/profile", profileData);
      toast.success("Profile saved successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.msg || "Failed to save profile.");
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImportClick = async () => {
    try {
      setShowImportModal(true);
      setLoadingResumes(true);
      const response = await axiosAPI.get("/resume/all");
      setUserResumes(response.data.resumes || []);
    } catch (error) {
      toast.error("Failed to load your resumes.");
      console.error("Error fetching resumes:", error);
    } finally {
      setLoadingResumes(false);
    }
  };

  const handleImportResume = async (resumeId: string) => {
    try {
      setImporting(true);
      const response = await axiosAPI.post(`/profile/import/${resumeId}`);
      if (response.data.profile) {
        setProfileData(response.data.profile);
        toast.success("Profile updated from resume!");
        setShowImportModal(false);
      }
    } catch (error) {
      toast.error("Failed to import from resume.");
      console.error("Error importing profile:", error);
    } finally {
      setImporting(false);
    }
  };

  const calculateCompleteness = () => {
    let score = 0;
    const personalFilled = [profileData.fullName, profileData.email, profileData.phone, profileData.linkedin].filter(Boolean).length;
    score += (personalFilled / 4) * 20;

    if (profileData.experience && profileData.experience.length > 0) {
      score += 25;
    }

    if (profileData.projects && profileData.projects.length > 0) {
      score += 20;
    }

    if (profileData.skills && profileData.skills.length > 0) {
      score += Math.min(20, (profileData.skills.length / 5) * 20);
    }

    if (profileData.education && profileData.education.length > 0) {
      score += 15;
    }

    return Math.round(score);
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter((s) => s !== skillToRemove),
    });
  };

  // Experience Handlers
  const addExperience = () => {
    setProfileData({
      ...profileData,
      experience: [
        ...profileData.experience,
        { title: "", company: "", location: "", duration: "", points: [""] },
      ],
    });
  };

  const updateExperience = (index: number, field: keyof ExperienceItem, value: any) => {
    const updated = [...profileData.experience];
    updated[index] = { ...updated[index], [field]: value };
    setProfileData({ ...profileData, experience: updated });
  };

  const removeExperience = (index: number) => {
    setProfileData({
      ...profileData,
      experience: profileData.experience.filter((_, i) => i !== index),
    });
  };

  // Project Handlers
  const addProject = () => {
    setProfileData({
      ...profileData,
      projects: [
        ...profileData.projects,
        { name: "", tech: [], description: "" },
      ],
    });
  };

  const updateProject = (index: number, field: keyof ProjectItem, value: any) => {
    const updated = [...profileData.projects];
    updated[index] = { ...updated[index], [field]: value };
    setProfileData({ ...profileData, projects: updated });
  };

  const removeProject = (index: number) => {
    setProfileData({
      ...profileData,
      projects: profileData.projects.filter((_, i) => i !== index),
    });
  };

  // Education Handlers
  const addEducation = () => {
    setProfileData({
      ...profileData,
      education: [
        ...profileData.education,
        { degree: "", school: "", year: "" },
      ],
    });
  };

  const updateEducation = (index: number, field: keyof EducationItem, value: any) => {
    const updated = [...profileData.education];
    updated[index] = { ...updated[index], [field]: value };
    setProfileData({ ...profileData, education: updated });
  };

  const removeEducation = (index: number) => {
    setProfileData({
      ...profileData,
      education: profileData.education.filter((_, i) => i !== index),
    });
  };

  // Achievement Handlers
  const addAchievement = () => {
    setProfileData({
      ...profileData,
      achievements: [
        ...profileData.achievements,
        { title: "", description: "", date: "" },
      ],
    });
  };

  const updateAchievement = (index: number, field: keyof AchievementItem, value: any) => {
    const updated = [...profileData.achievements];
    updated[index] = { ...updated[index], [field]: value };
    setProfileData({ ...profileData, achievements: updated });
  };

  const removeAchievement = (index: number) => {
    setProfileData({
      ...profileData,
      achievements: profileData.achievements.filter((_, i) => i !== index),
    });
  };

  if (loading) return <ProfilePageSkeleton />;

  const completeness = calculateCompleteness();

  return (
    <div className="w-full min-h-screen bg-transparent px-6 sm:px-8 lg:px-10 py-8 space-y-6">

        {/* Master Profile Header Card */}
        <div className="relative border border-border bg-card p-5 sm:p-6 rounded-none">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Master Profile
              </h1>
              <p className="text-muted-foreground text-xs">
                Your canonical background information used to tailor resumes and applications.
              </p>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-border">
              <button
                onClick={handleImportClick}
                className="px-4 py-2 border border-border hover:border-foreground/40 bg-card hover:bg-muted font-mono text-xs uppercase tracking-wider text-foreground rounded-none transition-colors inline-flex items-center gap-2"
              >
                <FileText size={13} />
                Import from Resume
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs uppercase tracking-wider rounded-none inline-flex items-center gap-2 disabled:opacity-50 transition-colors"
              >
                <Save size={13} />
                {isSaving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid: Left Navigation / Gauge & Right Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Left Column: Navigation & Metric */}
          <div className="lg:col-span-1 space-y-4">

            {/* Profile Completeness CAD Tile */}
            <div className="relative border border-border bg-card p-4 rounded-none space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Profile Completeness
                </span>
                <span className="font-mono text-base font-bold text-foreground">
                  {completeness}%
                </span>
              </div>

              {/* Straight-line segmented gauge */}
              <div className="w-full h-2 bg-muted/60 border border-border flex p-0.5 gap-0.5">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${completeness}%` }}
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 size={12} className={cn(completeness >= 80 ? "text-emerald-500" : "text-muted-foreground")} />
                <span>
                  {completeness >= 80 
                    ? "Profile ready for tailoring"
                    : "Add more details to increase match precision"
                  }
                </span>
              </div>
            </div>

            {/* Segmented Tab Navigation */}
            <div className="border border-border bg-card divide-y divide-border">
              <button
                onClick={() => setActiveTab("personal")}
                className={cn(
                  "w-full px-4 py-3 text-xs uppercase tracking-wider font-mono text-left flex items-center justify-between transition-colors",
                  activeTab === "personal" 
                    ? "bg-foreground text-background font-bold" 
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                )}
              >
                <span className="flex items-center gap-2">
                  <User size={13} />
                  Personal Info
                </span>
                <ChevronRight size={12} className={activeTab === "personal" ? "opacity-100" : "opacity-30"} />
              </button>

              <button
                onClick={() => setActiveTab("experience")}
                className={cn(
                  "w-full px-4 py-3 text-xs uppercase tracking-wider font-mono text-left flex items-center justify-between transition-colors",
                  activeTab === "experience" 
                    ? "bg-foreground text-background font-bold" 
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                )}
              >
                <span className="flex items-center gap-2">
                  <Briefcase size={13} />
                  Work & Education
                </span>
                <span className="text-[10px] opacity-70">
                  ({profileData.experience.length + profileData.education.length})
                </span>
              </button>

              <button
                onClick={() => setActiveTab("skills")}
                className={cn(
                  "w-full px-4 py-3 text-xs uppercase tracking-wider font-mono text-left flex items-center justify-between transition-colors",
                  activeTab === "skills" 
                    ? "bg-foreground text-background font-bold" 
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                )}
              >
                <span className="flex items-center gap-2">
                  <List size={13} />
                  Skills & Projects
                </span>
                <span className="text-[10px] opacity-70">
                  ({profileData.skills.length + profileData.projects.length})
                </span>
              </button>

              <button
                onClick={() => setActiveTab("achievements")}
                className={cn(
                  "w-full px-4 py-3 text-xs uppercase tracking-wider font-mono text-left flex items-center justify-between transition-colors",
                  activeTab === "achievements" 
                    ? "bg-foreground text-background font-bold" 
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                )}
              >
                <span className="flex items-center gap-2">
                  <Trophy size={13} />
                  Achievements
                </span>
                <span className="text-[10px] opacity-70">
                  ({profileData.achievements.length})
                </span>
              </button>
            </div>

          </div>

          {/* Right Column: Tab Editor Panel */}
          <div className="lg:col-span-3">
            <div className="relative border border-border bg-card p-6 sm:p-7 rounded-none min-h-[560px]">
              {/* TAB 1: PERSONAL DETAILS */}
              {activeTab === "personal" && (
                <div className="space-y-6">
                  <div className="border-b border-border pb-3.5 flex items-center justify-between">
                    <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
                      <User size={15} />
                      Personal Details
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-xs font-semibold text-foreground">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        className="flat-input w-full px-3 py-2 text-xs rounded-none border-border"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-xs font-semibold text-foreground">
                        Primary Email *
                      </label>
                      <input
                        type="email"
                        placeholder="john.doe@example.com"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="flat-input w-full px-3 py-2 text-xs rounded-none border-border font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-xs font-semibold text-foreground">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="flat-input w-full px-3 py-2 text-xs rounded-none border-border font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-xs font-semibold text-foreground">
                        LinkedIn Profile URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        value={profileData.linkedin}
                        onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                        className="flat-input w-full px-3 py-2 text-xs rounded-none border-border font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-xs font-semibold text-foreground">
                        GitHub Profile URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/username"
                        value={profileData.github}
                        onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                        className="flat-input w-full px-3 py-2 text-xs rounded-none border-border font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-xs font-semibold text-foreground">
                        Portfolio / Website
                      </label>
                      <input
                        type="url"
                        placeholder="https://mywebsite.com"
                        value={profileData.portfolio}
                        onChange={(e) => setProfileData({ ...profileData, portfolio: e.target.value })}
                        className="flat-input w-full px-3 py-2 text-xs rounded-none border-border font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: WORK & EDUCATION */}
              {activeTab === "experience" && (
                <div className="space-y-8">
                  {/* Work Experience */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-border pb-3">
                      <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Briefcase size={15} />
                        Work Experience
                      </h2>
                      <button
                        onClick={addExperience}
                        className="px-3 py-1.5 font-mono text-xs uppercase tracking-wider border border-border hover:border-foreground/40 bg-card hover:bg-muted rounded-none inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Plus size={12} /> Add Role
                      </button>
                    </div>

                    {profileData.experience.length === 0 ? (
                      <div className="text-center py-10 border border-dashed border-border rounded-none text-muted-foreground font-mono text-xs">
                        No work history added yet. Click "+ Add Role" to record experience.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {profileData.experience.map((exp, idx) => (
                          <div key={idx} className="relative border border-border p-4 rounded-none bg-background space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-border/60">
                              <span className="font-mono text-xs text-muted-foreground">
                                Position #{idx + 1}
                              </span>
                              <button
                                onClick={() => removeExperience(idx)}
                                className="font-mono text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1 transition-colors"
                              >
                                <X size={12} /> Remove
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="font-mono text-xs text-muted-foreground">Job Title</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Senior Software Engineer"
                                  value={exp.title}
                                  onChange={(e) => updateExperience(idx, "title", e.target.value)}
                                  className="flat-input w-full px-2.5 py-1.5 text-xs rounded-none border-border"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-xs text-muted-foreground">Company</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Stripe"
                                  value={exp.company}
                                  onChange={(e) => updateExperience(idx, "company", e.target.value)}
                                  className="flat-input w-full px-2.5 py-1.5 text-xs rounded-none border-border"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-xs text-muted-foreground">Location</label>
                                <input
                                  type="text"
                                  placeholder="e.g. San Francisco, CA / Remote"
                                  value={exp.location}
                                  onChange={(e) => updateExperience(idx, "location", e.target.value)}
                                  className="flat-input w-full px-2.5 py-1.5 text-xs rounded-none border-border"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-xs text-muted-foreground">Duration</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Jan 2023 - Present"
                                  value={exp.duration}
                                  onChange={(e) => updateExperience(idx, "duration", e.target.value)}
                                  className="flat-input w-full px-2.5 py-1.5 text-xs rounded-none border-border font-mono"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <label className="font-mono text-xs text-muted-foreground">
                                Accomplishment Bullets (One per line)
                              </label>
                              <textarea
                                placeholder="• Engineered distributed streaming pipeline processing 40k events/sec&#10;• Reduced latency by 35% with Redis cluster cache"
                                value={Array.isArray(exp.points) ? exp.points.join("\n") : exp.points}
                                onChange={(e) => updateExperience(idx, "points", e.target.value.split("\n"))}
                                rows={3}
                                className="flat-input w-full p-2 text-xs font-mono rounded-none border-border"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Education */}
                  <div className="space-y-4 pt-6 border-t border-border">
                    <div className="flex justify-between items-center border-b border-border pb-3">
                      <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
                        <GraduationCap size={15} />
                        Education
                      </h2>
                      <button
                        onClick={addEducation}
                        className="px-3 py-1.5 font-mono text-xs uppercase tracking-wider border border-border hover:border-foreground/40 bg-card hover:bg-muted rounded-none inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Plus size={12} /> Add Degree
                      </button>
                    </div>

                    {profileData.education.length === 0 ? (
                      <div className="text-center py-8 border border-dashed border-border rounded-none text-muted-foreground font-mono text-xs">
                        No education records added yet.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {profileData.education.map((edu, idx) => (
                          <div key={idx} className="relative border border-border p-4 rounded-none bg-background">
                            <div className="flex items-center justify-between pb-2 border-b border-border/60 mb-3">
                              <span className="font-mono text-xs text-muted-foreground">
                                Degree #{idx + 1}
                              </span>
                              <button
                                onClick={() => removeEducation(idx)}
                                className="font-mono text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1 transition-colors"
                              >
                                <X size={12} /> Remove
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="font-mono text-xs text-muted-foreground">Degree / Major</label>
                                <input
                                  type="text"
                                  placeholder="e.g. B.S. in Computer Science"
                                  value={edu.degree}
                                  onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                                  className="flat-input w-full px-2.5 py-1.5 text-xs rounded-none border-border"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-xs text-muted-foreground">Institution / School</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Stanford University"
                                  value={edu.school}
                                  onChange={(e) => updateEducation(idx, "school", e.target.value)}
                                  className="flat-input w-full px-2.5 py-1.5 text-xs rounded-none border-border"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-xs text-muted-foreground">Graduation Year</label>
                                <input
                                  type="text"
                                  placeholder="e.g. 2020 - 2024"
                                  value={edu.year}
                                  onChange={(e) => updateEducation(idx, "year", e.target.value)}
                                  className="flat-input w-full px-2.5 py-1.5 text-xs rounded-none border-border font-mono"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: SKILLS & PROJECTS */}
              {activeTab === "skills" && (
                <div className="space-y-8">
                  {/* Skills Cloud */}
                  <div className="space-y-4">
                    <div className="border-b border-border pb-3 flex items-center justify-between">
                      <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
                        <List size={15} />
                        Skills
                      </h2>
                      <span className="font-mono text-xs text-muted-foreground">
                        {profileData.skills.length} skills added
                      </span>
                    </div>

                    <div className="flex gap-2 max-w-md">
                      <input
                        type="text"
                        placeholder="Add skill (e.g. TypeScript, Go, PyTorch...)"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                        className="flat-input flex-1 px-3 py-1.5 text-xs rounded-none border-border font-mono"
                      />
                      <button
                        onClick={addSkill}
                        className="px-4 py-1.5 bg-foreground text-background hover:bg-foreground/90 font-semibold text-xs uppercase tracking-wider rounded-none inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Plus size={12} /> Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 p-3.5 border border-border bg-background min-h-[64px]">
                      {profileData.skills.length === 0 ? (
                        <span className="font-mono text-xs text-muted-foreground m-auto">
                          No skills added yet. Enter keywords above and press Add.
                        </span>
                      ) : (
                        profileData.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted border border-border text-foreground font-mono text-xs rounded-none"
                          >
                            {skill}
                            <button
                              onClick={() => removeSkill(skill)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <X size={11} />
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Projects */}
                  <div className="space-y-4 pt-6 border-t border-border">
                    <div className="flex justify-between items-center border-b border-border pb-3">
                      <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Terminal size={15} />
                        Key Projects
                      </h2>
                      <button
                        onClick={addProject}
                        className="px-3 py-1.5 font-mono text-xs uppercase tracking-wider border border-border hover:border-foreground/40 bg-card hover:bg-muted rounded-none inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Plus size={12} /> Add Project
                      </button>
                    </div>

                    {profileData.projects.length === 0 ? (
                      <div className="text-center py-8 border border-dashed border-border rounded-none text-muted-foreground font-mono text-xs">
                        No projects added yet.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {profileData.projects.map((proj, idx) => (
                          <div key={idx} className="relative border border-border p-4 rounded-none bg-background space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-border/60">
                              <span className="font-mono text-xs text-muted-foreground">
                                Project #{idx + 1}
                              </span>
                              <button
                                onClick={() => removeProject(idx)}
                                className="font-mono text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1 transition-colors"
                              >
                                <X size={12} /> Remove
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="font-mono text-xs text-muted-foreground">Project Name</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Distributed Consensus Engine"
                                  value={proj.name}
                                  onChange={(e) => updateProject(idx, "name", e.target.value)}
                                  className="flat-input w-full px-2.5 py-1.5 text-xs rounded-none border-border"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-xs text-muted-foreground">Tech Stack (comma-separated)</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Go, Raft, gRPC, Docker"
                                  value={Array.isArray(proj.tech) ? proj.tech.join(", ") : proj.tech}
                                  onChange={(e) => updateProject(idx, "tech", e.target.value.split(",").map(t => t.trim()))}
                                  className="flat-input w-full px-2.5 py-1.5 text-xs rounded-none border-border font-mono"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="font-mono text-xs text-muted-foreground">Description & Key Contributions</label>
                              <textarea
                                placeholder="Architected high-throughput replicated log handling 50k writes/sec with automated leader election..."
                                value={proj.description}
                                onChange={(e) => updateProject(idx, "description", e.target.value)}
                                rows={3}
                                className="flat-input w-full p-2 text-xs font-mono rounded-none border-border"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: ACHIEVEMENTS */}
              {activeTab === "achievements" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
                      <Trophy size={15} />
                      Achievements & Honors
                    </h2>
                    <button
                      onClick={addAchievement}
                      className="px-3 py-1.5 font-mono text-xs uppercase tracking-wider border border-border hover:border-foreground/40 bg-card hover:bg-muted rounded-none inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Plus size={12} /> Add Item
                    </button>
                  </div>

                  {profileData.achievements && profileData.achievements.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-border rounded-none text-muted-foreground font-mono text-xs">
                      No achievements added yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {profileData.achievements && profileData.achievements.map((ach, idx) => (
                        <div key={idx} className="relative border border-border p-4 rounded-none bg-background space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-border/60">
                            <span className="font-mono text-xs text-muted-foreground">
                              Achievement #{idx + 1}
                            </span>
                            <button
                              onClick={() => removeAchievement(idx)}
                              className="font-mono text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1 transition-colors"
                            >
                              <X size={12} /> Remove
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-1 sm:col-span-2">
                              <label className="font-mono text-xs text-muted-foreground">Title / Honor</label>
                              <input
                                type="text"
                                placeholder="e.g. 1st Place - Global AI Systems Hackathon"
                                value={ach.title}
                                onChange={(e) => updateAchievement(idx, "title", e.target.value)}
                                className="flat-input w-full px-2.5 py-1.5 text-xs rounded-none border-border"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-mono text-xs text-muted-foreground">Date / Year</label>
                              <input
                                type="text"
                                placeholder="e.g. Nov 2024"
                                value={ach.date}
                                onChange={(e) => updateAchievement(idx, "date", e.target.value)}
                                className="flat-input w-full px-2.5 py-1.5 text-xs rounded-none border-border font-mono"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="font-mono text-xs text-muted-foreground">Summary</label>
                            <textarea
                              placeholder="Awarded top engineering prize across 120 global projects for distributed indexing protocol..."
                              value={ach.description}
                              onChange={(e) => updateAchievement(idx, "description", e.target.value)}
                              rows={2}
                              className="flat-input w-full p-2 text-xs font-mono rounded-none border-border"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>

      {/* RESUME IMPORT MODAL */}
      {showImportModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-background/80 backdrop-blur-sm"
          onClick={() => setShowImportModal(false)}
        >
          <div 
            className="relative w-full max-w-xl max-h-[80vh] flex flex-col bg-card shadow-2xl border border-border rounded-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-none border border-border bg-background flex items-center justify-center">
                  <FileText size={15} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">Import Profile From Resume</h2>
                  <p className="text-xs text-muted-foreground">Select an existing document to extract profile details.</p>
                </div>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-1 text-muted-foreground hover:text-foreground border border-transparent hover:border-border rounded-none transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto p-4 space-y-2 bg-background">
              {loadingResumes ? (
                <div className="flex flex-col justify-center items-center h-48 gap-3">
                  <div className="w-5 h-5 border-2 border-border border-t-foreground rounded-none animate-spin" />
                  <p className="font-mono text-xs uppercase text-muted-foreground">Fetching resumes...</p>
                </div>
              ) : userResumes.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground font-mono text-xs space-y-1">
                  <FileText size={28} className="mx-auto mb-2 opacity-30" />
                  <p className="font-bold">No Resumes Found</p>
                  <p className="text-xs text-muted-foreground">Create a resume first to extract details.</p>
                </div>
              ) : (
                <div className="divide-y divide-border border border-border">
                  {userResumes.map((resItem) => (
                    <div
                      key={resItem.id}
                      onClick={() => !importing && handleImportResume(resItem.id)}
                      className={cn(
                        "p-3.5 bg-card hover:bg-muted/40 cursor-pointer transition-colors flex items-center justify-between group",
                        importing && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={15} className="text-muted-foreground shrink-0" />
                        <div>
                          <p className="font-semibold text-xs text-foreground line-clamp-1">{resItem.title}</p>
                          <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                            Created: {new Date(resItem.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground flex items-center gap-1 transition-colors">
                        Select <ChevronRight size={12} />
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 p-3.5 border-t border-border bg-card">
              <button
                onClick={() => setShowImportModal(false)}
                disabled={importing}
                className="px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground border border-border bg-background rounded-none transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
