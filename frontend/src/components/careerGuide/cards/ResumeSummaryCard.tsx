import { Badge } from "@/components/ui/badge";
import { ResumeSummaryData } from "@/types/careerGuide";

interface ResumeSummaryCardProps {
  data: ResumeSummaryData;
}

// Helper to safely format string or array of tags
function parseTags(val: unknown): string[] {
  if (Array.isArray(val)) {
    return val.map((s) => String(s).trim()).filter(Boolean);
  }
  if (typeof val === "string") {
    return val
      .split(/[,|•·;]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export function ResumeSummaryCard({ data }: ResumeSummaryCardProps) {
  if (!data) return null;

  const skills = parseTags(data.skills);
  const achievements = parseTags(data.achievements);
  const experiences = Array.isArray(data.experience) ? data.experience : [];
  const educations = Array.isArray(data.education) ? data.education : [];
  const projects = Array.isArray(data.projects) ? data.projects : [];

  return (
    <div className="border border-border bg-card rounded-none overflow-hidden max-w-xl font-sans shadow-xs relative">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-muted/20">
        <div className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
          Resume Summary
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          This is what I understood from your resume
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Name & Contact */}
        {(data.fullName || data.email || data.phone) && (
          <div className="space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
              Contact
            </div>
            <div className="space-y-0.5">
              {data.fullName && (
                <div className="text-sm font-semibold text-foreground">
                  {data.fullName}
                </div>
              )}
              {data.email && (
                <div className="font-mono text-xs text-muted-foreground">
                  {data.email}
                </div>
              )}
              {data.phone && (
                <div className="font-mono text-xs text-muted-foreground">
                  {data.phone}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
              Skills
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, i) => (
                <Badge key={i} variant="secondary" className="text-[10px] normal-case rounded-none">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className="space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
              Experience
            </div>
            <div className="space-y-2">
              {experiences.map((exp, i) => (
                <div key={i} className="border-l-2 border-border pl-3 space-y-0.5">
                  <div className="text-xs font-semibold text-foreground">
                    {exp.role || "Role"}
                    {exp.company && (
                      <span className="font-normal text-muted-foreground"> @ {exp.company}</span>
                    )}
                  </div>
                  {exp.duration && (
                    <div className="font-mono text-[10px] text-muted-foreground">{exp.duration}</div>
                  )}
                  {exp.description && (
                    <div className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {educations.length > 0 && (
          <div className="space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
              Education
            </div>
            <div className="space-y-2">
              {educations.map((edu, i) => (
                <div key={i} className="border-l-2 border-border pl-3 space-y-0.5">
                  <div className="text-xs font-semibold text-foreground">
                    {edu.degree || "Degree"}
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground">
                    {edu.institution}{edu.year ? ` · ${edu.year}` : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
              Projects
            </div>
            <div className="space-y-2">
              {projects.map((proj, i) => {
                const projectTech = parseTags(proj.tech);
                return (
                  <div key={i} className="border-l-2 border-border pl-3 space-y-0.5">
                    <div className="text-xs font-semibold text-foreground">{proj.name}</div>
                    {proj.description && (
                      <div className="text-xs text-muted-foreground line-clamp-2">{proj.description}</div>
                    )}
                    {projectTech.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {projectTech.map((t, j) => (
                          <Badge key={j} variant="outline" className="text-[9px] normal-case py-0 rounded-none">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
              Achievements
            </div>
            <ul className="space-y-1">
              {achievements.map((ach, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="text-foreground mt-px shrink-0">·</span>
                  {ach}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Note */}
        <div className="pt-2 border-t border-border">
          <p className="text-[11px] text-muted-foreground italic">
            You can correct me by chatting — just tell me what I got wrong.
          </p>
        </div>
      </div>
    </div>
  );
}
