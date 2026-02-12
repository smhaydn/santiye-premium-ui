import * as React from "react"
import { cn } from "@/lib/utils"

import { useRef, useEffect } from "react"
import { animateCardHover, resetCardHover } from "@/animations/interactions"
import { animateFadeIn } from "@/animations/entry"

function Card({
  className,
  interactive = false,
  delay = 0,
  onMouseEnter,
  onMouseLeave,
  ...props
}: React.ComponentProps<"div"> & {
  interactive?: boolean,
  delay?: number
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current && delay >= 0) {
      animateFadeIn(cardRef.current, delay);
    }
  }, [delay]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (interactive && cardRef.current) animateCardHover(cardRef.current);
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (interactive && cardRef.current) resetCardHover(cardRef.current);
    if (onMouseLeave) onMouseLeave(e);
  };

  return (
    <div
      ref={cardRef}
      data-slot="card"
      className={cn(
        "bg-card/80 backdrop-blur-md text-card-foreground flex flex-col gap-6 rounded-xl border border-border/50 py-6 shadow-xl transition-all duration-300",
        interactive && "cursor-pointer",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-bold tracking-tight text-lg", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm font-medium", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
