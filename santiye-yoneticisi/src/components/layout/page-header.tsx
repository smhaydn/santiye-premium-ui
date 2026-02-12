'use client';

import { useRef, useEffect } from "react";
import { ChevronLeft, History, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import gsap from "gsap";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    backLink?: string;
    action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, backLink, action }: PageHeaderProps) {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        if (titleRef.current) {
            tl.from(titleRef.current, {
                x: -20,
                opacity: 0,
                duration: 0.8,
                delay: 0.1
            });
        }

        if (subtitleRef.current) {
            tl.from(subtitleRef.current, {
                x: -15,
                opacity: 0,
                duration: 0.8
            }, "-=0.6");
        }
    }, [title, subtitle]);

    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-4 md:px-0 mb-6 group/header">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                    {backLink && (
                        <Link href={backLink}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/40 dark:hover:bg-white/10 transition-all active:scale-90">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                    )}
                    <h1 ref={titleRef} className="text-2xl md:text-4xl font-black tracking-tight text-foreground font-heading">
                        {title}
                    </h1>
                    <div className="opacity-0 group-hover/header:opacity-100 transition-opacity duration-300">
                        <HelpCircle className="w-4 h-4 text-muted-foreground/30 hover:text-primary transition-colors cursor-help" />
                    </div>
                </div>
                {subtitle && (
                    <span ref={subtitleRef} className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] ml-0.5">
                        {subtitle}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-3">
                {action}
                {!action && (
                    <Button variant="outline" size="sm" className="rounded-full border-dashed border-border/60 text-muted-foreground hover:text-foreground hover:bg-white/40 dark:hover:bg-white/5 transition-all">
                        <History className="mr-2 h-4 w-4" />
                        Geçmiş
                    </Button>
                )}
            </div>
        </div>
    );
}
