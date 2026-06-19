declare module "lucide-react" {
  import type { ComponentType, SVGProps } from "react";

  export type Icon = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;

  export const Activity: Icon;
  export const BarChart3: Icon;
  export const CalendarCheck: Icon;
  export const Check: Icon;
  export const Circle: Icon;
  export const Dumbbell: Icon;
  export const Heart: Icon;
  export const HeartPulse: Icon;
  export const Home: Icon;
  export const Ruler: Icon;
  export const Scale: Icon;
  export const Settings: Icon;
  export const Sparkles: Icon;
  export const Target: Icon;
  export const Trophy: Icon;
}
