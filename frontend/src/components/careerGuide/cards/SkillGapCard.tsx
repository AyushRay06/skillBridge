import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkillGapData } from "@/types/careerGuide";

interface SkillGapCardProps {
  data: SkillGapData;
  onMakeRoadmap?: (roleName: string) => void;
}

export function SkillGapCard({ data, onMakeRoadmap }: SkillGapCardProps) {
  if (!data) return null;

  const prioritySet = new Set(Array.isArray(data?.priorityMissing) ? data.priorityMissing : []);
  const haveSkills = Array.isArray(data?.haveSkills) ? data.haveSkills : [];
  const missingSkills = Array.isArray(data?.missingSkills) ? data.missingSkills : [];

  return (
    <div className="border border-border bg-card rounded-none overflow-hidden shadow-xs relative">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-muted/20">
        <div className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
          Skill Gap
          {data.roleName && (
            <span className="font-normal text-muted-foreground ml-1 normal-case">
              for {data.roleName}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* You Have */}
          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
              You Have
            </div>
            {haveSkills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {haveSkills.map((skill, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-[10px] normal-case border-border bg-muted/40 text-foreground font-normal"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No matching skills found.</p>
            )}
          </div>

          {/* You Need */}
          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
              You Need
            </div>
            {missingSkills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.map((skill, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className={`text-[10px] normal-case ${
                      prioritySet.has(skill) && i < 3
                        ? "border-foreground/40 bg-foreground/10 text-foreground font-semibold"
                        : "border-border/60 bg-muted/30 text-muted-foreground font-normal"
                    }`}
                  >
                    {prioritySet.has(skill) && i < 3 ? `${i + 1}. ` : ""}{skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No missing skills — you're ready!</p>
            )}
          </div>
        </div>

        {/* Priority note */}
        {data.priorityMissing && data.priorityMissing.length > 0 && (
          <p className="text-[11px] text-muted-foreground">
            Numbered badges represent high-priority skills recommended to learn first.
          </p>
        )}

        {/* Action */}
        {onMakeRoadmap && data.roleName && (
          <div className="pt-1 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-[11px] rounded-none border-border hover:border-foreground/40 hover:bg-muted text-foreground transition-all active:scale-95 cursor-pointer font-medium"
              onClick={() => onMakeRoadmap(data.roleName)}
            >
              Make Roadmap for {data.roleName}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
