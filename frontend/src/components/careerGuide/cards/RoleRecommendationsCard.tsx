import { Button } from "@/components/ui/button";
import { RoleRecommendation } from "@/types/careerGuide";
import { Check } from "@/components/animate-ui/icons";

interface RoleRecommendationsCardProps {
  data: { roles: RoleRecommendation[] };
  onSkillGap: (roleName: string) => void;
  onMakeRoadmap: (roleName: string) => void;
  onFindJobs: (roleName: string) => void;
}

export function RoleRecommendationsCard({
  data,
  onSkillGap,
  onMakeRoadmap,
  onFindJobs,
}: RoleRecommendationsCardProps) {
  if (!data?.roles?.length) return null;

  return (
    <div className="rounded-lg border border-border bg-card text-foreground overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/60">
        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          Career Path & Role Recommendations
        </div>
        <h3 className="text-base font-medium text-foreground tracking-tight mt-0.5">
          Top Matching Career Paths
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Based on your skills, interests, and profile assessment
        </p>
      </div>

      <div className="divide-y divide-border/60">
        {(Array.isArray(data?.roles) ? data.roles : []).map((role, i) => {
          const displayName = role.roleNameLocalized || role.roleName;
          const matched = Array.isArray(role.matchedSkills) ? role.matchedSkills : [];
          const missing = Array.isArray(role.missingSkills) ? role.missingSkills : [];
          return (
            <div key={role.roleId || i} className="p-5 space-y-3.5">
              {/* Role title + match score */}
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold text-sm text-foreground">
                  {displayName}
                </div>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-sm border border-border bg-muted/40 text-foreground shrink-0">
                  {role.score}% match
                </span>
              </div>

              {/* Personalised reasoning */}
              {role.why && (
                <p className="text-xs text-muted-foreground leading-relaxed">{role.why}</p>
              )}

              {/* Skills you have */}
              {matched.length > 0 && (
                <div className="space-y-1.5">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Matching Strengths
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {matched.map((s, j) => (
                      <span
                        key={j}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm border border-border bg-muted/30 text-foreground text-xs font-mono"
                      >
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills to learn */}
              {missing.length > 0 && (
                <div className="space-y-1.5">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Skills to Develop
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {missing.map((s, j) => (
                      <span
                        key={j}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm border border-dashed border-border text-muted-foreground text-xs font-mono"
                      >
                        + {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-3 font-mono rounded-md border-border bg-background hover:bg-muted text-foreground cursor-pointer"
                  onClick={() => onSkillGap(role.roleName)}
                >
                  Skill Gap
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-3 font-mono rounded-md border-border bg-background hover:bg-muted text-foreground cursor-pointer"
                  onClick={() => onMakeRoadmap(role.roleName)}
                >
                  Make Roadmap
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-3 font-mono rounded-md border-border bg-background hover:bg-muted text-foreground cursor-pointer"
                  onClick={() => onFindJobs(role.roleName)}
                >
                  Find Jobs
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
