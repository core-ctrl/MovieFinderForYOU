import { HugeiconsIcon } from "@hugeicons/react";

export default function AppIcon({
  icon,
  size = 18,
  strokeWidth = 1.8,
  className = "",
  ...props
}) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  );
}
