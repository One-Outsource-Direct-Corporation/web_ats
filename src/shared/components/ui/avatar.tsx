import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget as HTMLImageElement;
    if (!img.dataset.fallback) {
      img.dataset.fallback = "1";
      img.src = "/placeholder.svg";
    }

    if (typeof props.onError === "function") {
      try {
        (props.onError as any)(event);
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("w-full h-full object-cover aspect-square", className)}
      onError={handleError}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn("bg-muted flex size-full items-center justify-center rounded-full", className)}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
