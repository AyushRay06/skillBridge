/**
 * SkillBridge - WhatsApp Card Formatter
 *
 * Converts structured Career Guide card payloads (roadmaps, recommendations,
 * resume reviews, skill gaps, jobs, mock interviews) into clean, high-impact
 * WhatsApp markdown messages.
 */

export function formatCardForWhatsApp(cardPayload) {
  if (!cardPayload || !cardPayload.type || !cardPayload.data) return "";

  const { type, data } = cardPayload;

  switch (type) {
    case "roadmap": {
      const title = data.title || data.targetRole || data.targetSkill || "Learning Roadmap";
      let text = `\n\n🗺️ *ROADMAP: ${title}*\n`;
      if (data.estimatedWeeks) text += `⏱️ *Estimated Duration:* ~${data.estimatedWeeks} weeks\n`;
      text += `━━━━━━━━━━━━━━━━━━━━━\n`;

      const steps = data.steps || [];
      steps.forEach((s, idx) => {
        const stepNum = s.stepNumber || idx + 1;
        const statusEmoji = s.status === "done" ? "✅" : "📌";
        text += `\n${statusEmoji} *Step ${stepNum}: ${s.title}*\n`;
        if (s.whatToLearn) {
          const summary = s.whatToLearn.length > 150 ? s.whatToLearn.slice(0, 150) + "..." : s.whatToLearn;
          text += `   ${summary}\n`;
        }
        if (s.resources && Array.isArray(s.resources) && s.resources.length > 0) {
          const firstResource = s.resources[0];
          const resLabel = firstResource.label || firstResource.title || "Resource";
          const resUrl = firstResource.url || "";
          if (resUrl) {
            text += `   🔗 _${resLabel}:_ ${resUrl}\n`;
          }
        }
      });

      text += `\n💡 _Tip: You can ask me to explain any step in detail or test your knowledge!_`;
      return text;
    }

    case "role_recommendations": {
      const recommendations = Array.isArray(data) ? data : data.recommendations || [];
      if (!recommendations.length) return "";

      let text = `\n\n🎯 *TOP RECOMMENDED ROLES FOR YOU:*\n━━━━━━━━━━━━━━━━━━━━━\n`;
      recommendations.slice(0, 4).forEach((r, idx) => {
        const score = Math.round(r.matchScore || r.score || 0);
        text += `\n*${idx + 1}. ${r.roleName || r.name}* (${score}% Match)\n`;
        if (r.matchedSkills && r.matchedSkills.length > 0) {
          text += `   ✅ *Matched:* ${r.matchedSkills.slice(0, 4).join(", ")}\n`;
        }
        if (r.missingSkills && r.missingSkills.length > 0) {
          text += `   ⚠️ *To Learn:* ${r.missingSkills.slice(0, 4).join(", ")}\n`;
        }
      });

      text += `\n💬 _Reply with the role name to generate a tailored roadmap or check available jobs!_`;
      return text;
    }

    case "skill_gap": {
      let text = `\n\n🔍 *SKILL GAP ANALYSIS: ${data.roleName || "Target Role"}*\n━━━━━━━━━━━━━━━━━━━━━\n`;
      if (data.haveSkills && data.haveSkills.length > 0) {
        text += `✅ *Skills You Have:*\n• ${data.haveSkills.join(", ")}\n\n`;
      }
      if (data.priorityMissing && data.priorityMissing.length > 0) {
        text += `⚠️ *Priority Skills to Learn:*\n• ${data.priorityMissing.join(", ")}\n\n`;
      } else if (data.missingSkills && data.missingSkills.length > 0) {
        text += `⚠️ *Skills to Learn:*\n• ${data.missingSkills.join(", ")}\n\n`;
      }
      return text;
    }

    case "resume_review": {
      let text = `\n\n📊 *RESUME REVIEW & ATS REPORT*\n━━━━━━━━━━━━━━━━━━━━━\n`;
      const score = data.overallScore || data.score || 75;
      text += `⭐ *Overall Rating:* ${score}/100\n`;
      if (data.targetRole) text += `🎯 *Evaluated for:* ${data.targetRole}\n`;
      text += `\n`;

      if (data.strengths && Array.isArray(data.strengths) && data.strengths.length > 0) {
        text += `*Key Strengths:*\n`;
        data.strengths.slice(0, 3).forEach((s) => (text += `• ${s}\n`));
        text += `\n`;
      }

      if (data.improvements && Array.isArray(data.improvements) && data.improvements.length > 0) {
        text += `*Actionable Improvements:*\n`;
        data.improvements.slice(0, 3).forEach((i) => (text += `• ${i}\n`));
        text += `\n`;
      }

      if (data.breakdown) {
        text += `*Score Breakdown:*\n`;
        for (const [k, v] of Object.entries(data.breakdown)) {
          text += `• ${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}/100\n`;
        }
      }
      return text;
    }

    case "job_matches": {
      const jobs = data.jobs || [];
      if (!jobs.length) return "";

      let text = `\n\n💼 *MATCHING OPENINGS: ${data.role || "Jobs"}*\n━━━━━━━━━━━━━━━━━━━━━\n`;
      jobs.slice(0, 4).forEach((j, idx) => {
        text += `\n*${idx + 1}. ${j.title}* @ *${j.company}*\n`;
        text += `   📍 ${j.location || "Remote"}\n`;
        if (j.salary) text += `   💰 ${j.salary}\n`;
        if (j.url) text += `   🔗 Apply: ${j.url}\n`;
      });
      return text;
    }

    case "mock_interview": {
      let text = `\n\n🎤 *MOCK INTERVIEW QUESTION*\n━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `📌 *Question ${data.questionNumber || 1}:* ${data.question}\n\n`;
      if (data.options && Array.isArray(data.options) && data.options.length > 0) {
        text += `*Options:*\n`;
        data.options.forEach((opt, i) => {
          text += `${i + 1}️⃣ ${opt}\n`;
        });
        text += `\n_Reply with the option number or your answer._\n`;
      } else {
        text += `_Type or send an audio voice note with your answer._\n`;
      }
      return text;
    }

    case "mock_interview_evaluation": {
      let text = `\n\n📝 *INTERVIEW EVALUATION*\n━━━━━━━━━━━━━━━━━━━━━\n`;
      if (data.score) text += `⭐ *Score:* ${data.score}/10\n`;
      if (data.feedback) text += `💬 *Feedback:* ${data.feedback}\n`;
      if (data.idealAnswer) text += `\n💡 *Ideal Answer:* ${data.idealAnswer}\n`;
      return text;
    }

    default:
      return "";
  }
}

