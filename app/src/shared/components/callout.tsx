import { cn } from "../utils/tailwind";

interface CalloutProps {
  emoji: string;
  text: string;
  color?: string;
}

export function Callout({ emoji, text, color }: CalloutProps) {
  return (
    <div className={cn(color, "rounded-md")}>
      <span className="text-base">{emoji}</span>
      <span className="text-sm">{text}</span>
    </div>
  );
}
