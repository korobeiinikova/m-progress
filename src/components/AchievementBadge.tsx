import { Sparkles } from "lucide-react";
import type { Achievement } from "../types";

export const AchievementBadge = ({ achievement }: { achievement: Achievement }) => (
  <article className={`achievement ${achievement.unlockedAt ? "achievement--open" : ""}`}>
    <Sparkles size={18} />
    <div>
      <strong>{achievement.title}</strong>
      <span>{achievement.description}</span>
    </div>
  </article>
);
