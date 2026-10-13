import { useAvatar } from "@/lib/sa";
import { cn } from "@/lib/utils";

export function MemberPhoto({ path, name, className }: { path: string | null | undefined; name: string; className?: string }) {
  const url = useAvatar(path);
  if (url) return <img src={url} alt={name} className={cn("object-cover", className)} />;
  return (
    <div className={cn("grid place-items-center bg-primary-gradient font-display text-gold", className)}>
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}
