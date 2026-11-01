"use client";

import { useState } from "react";
import { axiosAPI } from "@/lib/axiosInterface";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Plus, X, List, GraduationCap, Briefcase, User, Trophy, FileText, Zap, Terminal } from "lucide-react";
import ResumeDisplay from "@/components/ResumeDisplay";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface ResumeData {
  title: string;
  fullName: string;
  phone: string;
  email: string;
  github: string;
  linkedin: string;
  portfolio: string;
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    location: string;
    duration: string;
    points: string[];
  }>;
  projects: Array<{
    name: string;
    tech: string[];
    description: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    date: string;
  }>;
  jobDescription: string;
}

const initialData: ResumeData = {
  title: "",
  fullName: "",
  phone: "",
  email: "",
  github: "",
  linkedin: "",
  portfolio: "",
  skills: [],
  experience: [],
  projects: [],
  education: [],
  achievements: [],
  jobDescription: "",
};

export default function ResumeBuilder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ResumeData>(initialData);
  const [newSkill, setNewSkill] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedResumeId, setGeneratedResumeId] = useState<string | null>(
    null
  );

  const updateFormData = (field: keyof ResumeData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      updateFormData("skills", [...formData.skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    updateFormData(
      "skills",
      formData.skills.filter((skill) => skill !== skillToRemove)
    );
  };

  const addExperience = () => {
    updateFormData("experience", [
      ...formData.experience,
      {
        title: "",
        company: "",
        location: "",
        duration: "",
        points: [""],
      },
    ]);
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...formData.experience];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData("experience", updated);
  };

  const removeExperience = (index: number) => {
    updateFormData(
      "experience",
      formData.experience.filter((_, i) => i !== index)
    );
  };

  const addProject = () => {
    updateFormData("projects", [
      ...formData.projects,
      {
        name: "",
        tech: [],
        description: "",
      },
    ]);
  };

  const updateProject = (index: number, field: string, value: any) => {
    const updated = [...formData.projects];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData("projects", updated);
  };

  const removeProject = (index: number) => {
    updateFormData(
      "projects",
      formData.projects.filter((_, i) => i !== index)
    );
  };

  const addEducation = () => {
    updateFormData("education", [
      ...formData.education,
      {
        degree: "",
        school: "",
        year: "",
      },
    ]);
  };

  const updateEducation = (index: number, field: string, value: any) => {
    const updated = [...formData.education];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData("education", updated);
  };

  const removeEducation = (index: number) => {
    updateFormData(
      "education",
      formData.education.filter((_, i) => i !== index)
    );
  };

  const addAchievement = () => {
    updateFormData("achievements", [
      ...formData.achievements,
      {
        title: "",
        description: "",
        date: "",
      },
    ]);
  };

  const updateAchievement = (index: number, field: string, value: any) => {
    const updated = [...formData.achievements];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData("achievements", updated);
  };

  const removeAchievement = (index: number) => {
    updateFormData(
      "achievements",
      formData.achievements.filter((_, i) => i !== index)
    );
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return Boolean(
          formData.fullName && formData.email && formData.linkedin
        );
      case 2:
        return (
          formData.experience.length > 0 &&
          formData.education.length > 0 &&
          formData.experience.every(
            (exp) => exp.title && exp.company && exp.location && exp.duration
          ) &&
          formData.education.every(
            (edu) => edu.degree && edu.school && edu.year
          )
        );
      case 3:
        return (
          formData.skills.length > 0 &&
          formData.projects.length > 0 &&
          formData.projects.every(
            (proj) => proj.name && proj.description
          )
        );
      case 4:
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      toast.error("Please fill in all required fields before proceeding");
      return;
    }
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        title: formData.title || `${formData.fullName}'s Resume`,
      };

      const response = await axiosAPI.post("/resume/create", submitData);

      setGeneratedResumeId(response.data.resumeId);
      toast.success("Resume created successfully!");
    } catch (error: any) {
      console.error("Error submitting resume:", error);
      const status = error.response?.status;
      const data = error.response?.data;

      if (status === 429) {
        toast.error(data?.message || "You've reached your resume creation limit. Please try again later.", { duration: 6000 });
        if (data?.suggestion) {
          toast(data.suggestion, { icon: "💡", duration: 8000 });
        }
        if (data?.upgrade) {
          toast(data.upgrade, { icon: "⬆️", duration: 8000 });
        }
      } else if (error.response) {
        toast.error(error.response.data.msg || error.response.data.message || "Form Submission Failed");
      } else {
        toast.error("Form Submission Failed - Network Error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (generatedResumeId) {
    return (
      <ResumeDisplay
        resumeId={generatedResumeId}
        onBack={() => setGeneratedResumeId(null)}
      />
    );
  }

  const steps = [
    { number: 1, label: "Personal Details", icon: User },
    { number: 2, label: "Experience & Education", icon: Briefcase },
    { number: 3, label: "Skills & Projects", icon: List },
    { number: 4, label: "Achievements & JD", icon: Trophy },
  ];

  return (
    <div className="w-full min-h-screen px-6 sm:px-8 lg:px-10 py-8 space-y-6">
      {/* Header Bar with CAD Framing */}
      <div className="relative border border-border bg-card p-5 sm:p-6 rounded-none">
        <span className="absolute -top-1.5 -left-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
        <span className="absolute -top-1.5 -right-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
        <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>
        <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] text-foreground/40 font-bold select-none">+</span>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Resume Builder
            </h1>
            <p className="text-muted-foreground text-xs">
              Build an ATS-optimized resume with your career history and skills.
            </p>
          </div>

          <div className="text-xs font-mono text-muted-foreground self-start sm:self-auto">
            Step <span className="font-bold text-foreground">{currentStep} of 4</span>
          </div>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="border border-border bg-card p-2.5 rounded-none overflow-x-auto">
        <div className="flex justify-between items-center min-w-[500px] divide-x divide-border">
          {steps.map((step) => {
            const isCurrent = currentStep === step.number;
            const isDone = currentStep > step.number;
            return (
              <div 
                key={step.number} 
                className={cn(
                  "flex-1 px-4 py-2 flex items-center gap-2.5 transition-colors",
                  isCurrent ? "bg-muted/40" : ""
                )}
              >
                <span
                  className={cn(
                    "font-mono text-xs px-2 py-0.5 border rounded-none font-semibold",
                    isCurrent
                      ? "bg-foreground text-background border-foreground"
                      : isDone
                      ? "bg-muted border-border text-foreground"
                      : "bg-background border-border/60 text-muted-foreground"
                  )}
                >
                  0{step.number}
                </span>
                <span
                  className={cn(
                    "font-mono text-xs uppercase tracking-wider whitespace-nowrap",
                    isCurrent
                      ? "text-foreground font-bold"
                      : isDone
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Container */}
      <div className="w-full border border-border bg-card p-6 sm:p-8 rounded-none flex flex-col justify-between min-h-[500px]">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="border-b border-border pb-3">
                  <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-foreground flex items-center gap-2">
                    <User size={15} />
                    Personal & Contact Information
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="title" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Document Identifier</Label>
                    <input
                      id="title"
                      value={formData.title}
                      onChange={(e) => updateFormData("title", e.target.value)}
                      placeholder="e.g. Senior Frontend Engineer (Default)"
                      className="flat-input w-full px-3 py-2 text-sm rounded-none border-border font-mono"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="fullName" className="font-mono text-[10px] uppercase tracking-wider text-foreground">Full Name *</Label>
                      <input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => updateFormData("fullName", e.target.value)}
                        placeholder="John Doe"
                        className="flat-input w-full px-3 py-2 text-sm rounded-none border-border"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="phone" className="font-mono text-[10px] uppercase tracking-wider text-foreground">Phone Number *</Label>
                      <input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                        placeholder="+1 234 567 890"
                        className="flat-input w-full px-3 py-2 text-sm rounded-none border-border font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="email" className="font-mono text-[10px] uppercase tracking-wider text-foreground">Email Address *</Label>
                    <input
                      id="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      placeholder="john@example.com"
                      className="flat-input w-full px-3 py-2 text-sm rounded-none border-border font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="linkedin" className="font-mono text-[10px] uppercase tracking-wider text-foreground">LinkedIn URL *</Label>
                      <input
                        id="linkedin"
                        value={formData.linkedin}
                        onChange={(e) => updateFormData("linkedin", e.target.value)}
                        placeholder="https://linkedin.com/in/johndoe"
                        className="flat-input w-full px-3 py-2 text-sm rounded-none border-border font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="portfolio" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Portfolio URL</Label>
                      <input
                        id="portfolio"
                        value={formData.portfolio}
                        onChange={(e) => updateFormData("portfolio", e.target.value)}
                        placeholder="https://johndoe.com"
                        className="flat-input w-full px-3 py-2 text-sm rounded-none border-border font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="github" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">GitHub Profile</Label>
                    <input
                      id="github"
                      value={formData.github}
                      onChange={(e) => updateFormData("github", e.target.value)}
                      placeholder="https://github.com/johndoe"
                      className="flat-input w-full px-3 py-2 text-sm rounded-none border-border font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Experience & Education */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div>
                  <div className="border-b border-border pb-3 mb-4">
                    <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-foreground flex items-center gap-2">
                      <Briefcase size={15} />
                      Work Experience
                    </h2>
                  </div>
                  {formData.experience.map((exp, index) => (
                    <div key={index} className="border border-border p-4 mb-3 bg-muted/10 relative rounded-none">
                      <button 
                        onClick={() => removeExperience(index)}
                        className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors p-1"
                      >
                        <X size={14} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <input 
                          placeholder="Job Title *"
                          className="flat-input px-3 py-1.5 text-xs rounded-none border-border"
                          value={exp.title}
                          onChange={(e) => updateExperience(index, "title", e.target.value)}
                        />
                        <input 
                          placeholder="Company *"
                          className="flat-input px-3 py-1.5 text-xs rounded-none border-border"
                          value={exp.company}
                          onChange={(e) => updateExperience(index, "company", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <input 
                          placeholder="Location *"
                          className="flat-input px-3 py-1.5 text-xs rounded-none border-border"
                          value={exp.location}
                          onChange={(e) => updateExperience(index, "location", e.target.value)}
                        />
                        <input 
                          placeholder="Duration (e.g. Jun 2022 - Present) *"
                          className="flat-input px-3 py-1.5 text-xs rounded-none border-border font-mono"
                          value={exp.duration}
                          onChange={(e) => updateExperience(index, "duration", e.target.value)}
                        />
                      </div>
                      <textarea
                        className="flat-input w-full p-2.5 min-h-[90px] text-xs font-mono rounded-none border-border"
                        placeholder="Bullet points (one per line)..."
                        value={exp.points.join("\n")}
                        onChange={(e) => updateExperience(index, "points", e.target.value.split("\n"))}
                      />
                    </div>
                  ))}
                  <button 
                    onClick={addExperience}
                    className="w-full py-2 border border-dashed border-border hover:border-foreground/40 bg-card text-muted-foreground hover:text-foreground font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded-none"
                  >
                    <Plus size={13} /> Add Work Experience
                  </button>
                </div>

                <div>
                  <div className="border-b border-border pb-3 mb-4">
                    <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-foreground flex items-center gap-2">
                      <GraduationCap size={15} />
                      Education
                    </h2>
                  </div>
                  {formData.education.map((edu, index) => (
                    <div key={index} className="border border-border p-4 mb-3 bg-muted/10 relative rounded-none">
                      <button 
                        onClick={() => removeEducation(index)}
                        className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors p-1"
                      >
                        <X size={14} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <input 
                          placeholder="Degree / Major *"
                          className="flat-input px-3 py-1.5 text-xs rounded-none border-border"
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, "degree", e.target.value)}
                        />
                        <input 
                          placeholder="Institution / University *"
                          className="flat-input px-3 py-1.5 text-xs rounded-none border-border"
                          value={edu.school}
                          onChange={(e) => updateEducation(index, "school", e.target.value)}
                        />
                      </div>
                      <input 
                        placeholder="Graduation Year (e.g. 2024) *"
                        className="flat-input px-3 py-1.5 text-xs rounded-none border-border font-mono"
                        value={edu.year}
                        onChange={(e) => updateEducation(index, "year", e.target.value)}
                      />
                    </div>
                  ))}
                  <button 
                    onClick={addEducation}
                    className="w-full py-2 border border-dashed border-border hover:border-foreground/40 bg-card text-muted-foreground hover:text-foreground font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded-none"
                  >
                    <Plus size={13} /> Add Education
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Skills & Projects */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div>
                  <div className="border-b border-border pb-3 mb-4">
                    <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-foreground flex items-center gap-2">
                      <List size={15} />
                      Technical Skills
                    </h2>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <input
                      placeholder="Add technical skill (e.g. Next.js, PostgreSQL)"
                      className="flat-input px-3 py-2 text-xs flex-1 rounded-none border-border font-mono"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    />
                    <button
                      onClick={addSkill}
                      className="px-4 py-2 bg-foreground text-background font-mono text-xs uppercase tracking-wider hover:bg-foreground/90 rounded-none inline-flex items-center gap-1.5"
                    >
                      <Plus size={13} /> Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="px-2.5 py-1 bg-muted/40 text-foreground border border-border text-xs font-mono rounded-none inline-flex items-center gap-1.5">
                        {skill}
                        <X size={11} className="cursor-pointer hover:text-destructive" onClick={() => removeSkill(skill)} />
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="border-b border-border pb-3 mb-4">
                    <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-foreground flex items-center gap-2">
                      <FileText size={15} />
                      Key Projects
                    </h2>
                  </div>
                  {formData.projects.map((proj, index) => (
                    <div key={index} className="border border-border p-4 mb-3 bg-muted/10 relative rounded-none">
                      <button 
                        onClick={() => removeProject(index)}
                        className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors p-1"
                      >
                        <X size={14} />
                      </button>
                      <input 
                        placeholder="Project Name *"
                        className="flat-input px-3 py-1.5 text-xs rounded-none border-border w-full mb-3"
                        value={proj.name}
                        onChange={(e) => updateProject(index, "name", e.target.value)}
                      />
                      <input 
                        placeholder="Tech Stack (comma-separated, e.g. React, Node.js, Redis)"
                        className="flat-input px-3 py-1.5 text-xs rounded-none border-border w-full mb-3 font-mono"
                        value={proj.tech.join(", ")}
                        onChange={(e) => {
                          const techs = e.target.value.split(",").map(t => t.trim());
                          updateProject(index, "tech", techs);
                        }}
                      />
                      <textarea
                        className="flat-input w-full p-2.5 min-h-[80px] text-xs font-mono rounded-none border-border"
                        placeholder="Project description and key metrics *"
                        value={proj.description}
                        onChange={(e) => updateProject(index, "description", e.target.value)}
                      />
                    </div>
                  ))}
                  <button 
                    onClick={addProject}
                    className="w-full py-2 border border-dashed border-border hover:border-foreground/40 bg-card text-muted-foreground hover:text-foreground font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded-none"
                  >
                    <Plus size={13} /> Add Project
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Achievements & JD */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <div className="border-b border-border pb-3 mb-4">
                    <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-foreground flex items-center gap-2">
                      <Trophy size={15} />
                      Awards & Key Milestones
                    </h2>
                  </div>
                  {formData.achievements.map((ach, index) => (
                    <div key={index} className="border border-border p-4 mb-3 bg-muted/10 relative rounded-none">
                      <button 
                        onClick={() => removeAchievement(index)}
                        className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors p-1"
                      >
                        <X size={14} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <input 
                          placeholder="Achievement Title"
                          className="flat-input px-3 py-1.5 text-xs rounded-none border-border"
                          value={ach.title}
                          onChange={(e) => updateAchievement(index, "title", e.target.value)}
                        />
                        <input 
                          placeholder="Date (e.g. 2023)"
                          className="flat-input px-3 py-1.5 text-xs rounded-none border-border font-mono"
                          value={ach.date}
                          onChange={(e) => updateAchievement(index, "date", e.target.value)}
                        />
                      </div>
                      <textarea
                        className="flat-input w-full p-2.5 min-h-[70px] text-xs font-mono rounded-none border-border"
                        placeholder="Description of achievement"
                        value={ach.description}
                        onChange={(e) => updateAchievement(index, "description", e.target.value)}
                      />
                    </div>
                  ))}
                  <button 
                    onClick={addAchievement}
                    className="w-full py-2 border border-dashed border-border hover:border-foreground/40 bg-card text-muted-foreground hover:text-foreground font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded-none"
                  >
                    <Plus size={13} /> Add Achievement
                  </button>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <Label className="font-mono text-[10px] uppercase tracking-wider text-foreground mb-1 block">Target Job Description (Optional)</Label>
                  <p className="text-xs text-muted-foreground mb-2 font-mono">Biases ATS keywords and skills weighting during LaTeX compilation.</p>
                  <textarea
                    className="flat-input w-full p-3 min-h-[130px] text-xs font-mono rounded-none border-border"
                    placeholder="Paste job description requirements and qualifications here..."
                    value={formData.jobDescription}
                    onChange={(e) => updateFormData("jobDescription", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Stepper Navigation Footer */}
            <div className="flex justify-between mt-8 pt-4 border-t border-border">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={cn(
                  "px-4 py-2 border border-border bg-card font-mono text-xs uppercase tracking-wider rounded-none inline-flex items-center gap-1.5 transition-colors",
                  currentStep === 1 ? "opacity-30 cursor-not-allowed text-muted-foreground" : "text-foreground hover:border-foreground/40"
                )}
              >
                <ChevronLeft size={13} /> Previous
              </button>
              
              {currentStep === 4 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-foreground text-background hover:bg-foreground/90 font-mono text-xs uppercase tracking-wider font-semibold rounded-none inline-flex items-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? "Compiling..." : "Generate LaTeX Resume"} <Zap size={13} />
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="px-5 py-2 bg-foreground text-background hover:bg-foreground/90 font-mono text-xs uppercase tracking-wider font-semibold rounded-none inline-flex items-center gap-1.5 transition-colors"
                >
                  Next Step <ChevronRight size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
  );
}
