'use client';

import React, { useState, useEffect } from "react";
import { Building2, ChevronDown, Bell, Search, User, LogOut, Settings, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { MobileSidebar } from "@/components/layout/sidebar"; // Only mobile trigger needed
import { ModeToggle } from "@/components/mode-toggle"; // New Component

import { useRef } from "react";
import gsap from "gsap";

export function Header() {
    const router = useRouter();
    const [notificationCount, setNotificationCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const headerRef = useRef<HTMLElement>(null);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            const { count } = await supabase
                .from('purchase_requests')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'Bekliyor');

            setNotificationCount(count || 0);
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);

        // GSAP Entry Animation
        if (headerRef.current) {
            gsap.from(headerRef.current, {
                y: -50,
                opacity: 0,
                duration: 1,
                ease: "expo.out",
                delay: 0.1
            });
        }

        return () => clearInterval(interval);
    }, []);

    return (
        <header
            ref={headerRef}
            className="sticky top-4 z-20 flex items-center justify-between px-6 py-3 mx-4 mb-6 rounded-2xl glass transition-all"
        >

            {/* Left: Mobile Trigger & Context */}
            <div className="flex items-center gap-4">
                <MobileSidebar />

                {/* Breadcrumb / Page Title (Simplified for now) */}
                <div className="hidden md:flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">PROJE YÖNETİMİ</span>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-primary" />
                        <h2 className="text-sm font-bold text-foreground leading-none">CAMSAN & KOPARAN</h2>
                    </div>
                </div>
            </div>

            {/* Center: Search (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div className="relative w-full group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-secondary/50 hover:bg-secondary focus:bg-background border-transparent focus:border-ring rounded-xl py-2 pl-10 pr-4 text-sm transition-all outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-1"
                        placeholder="Modül, fatura veya personel ara..."
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                            CTRL
                        </kbd>
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                            K
                        </kbd>
                    </div>
                </div>
            </div>

            {/* Right: Actions & User */}
            <div className="flex items-center gap-3">

                <ModeToggle />

                <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground">
                    <Bell className="w-5 h-5" />
                    {notificationCount > 0 && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full ring-2 ring-background animate-pulse"></span>
                    )}
                </Button>

                <div className="h-8 w-px bg-border/60 mx-1"></div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-3 pl-1 pr-2 py-1 h-10 rounded-full hover:bg-secondary border border-transparent hover:border-border transition-all">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary/80 flex items-center justify-center text-xs font-bold text-primary-foreground shadow-sm">
                                SA
                            </div>
                            <div className="hidden md:flex flex-col items-start gap-0.5">
                                <span className="text-[12px] font-bold text-foreground leading-none">Sertan AYDIN</span>
                                <span className="text-[10px] text-muted-foreground font-medium leading-none">Yönetici</span>
                            </div>
                            <ChevronDown className="w-3 h-3 text-muted-foreground" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 glass">
                        <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground font-bold px-2 py-1.5">Hesabım</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer rounded-lg px-2 py-2 focus:bg-primary/10 focus:text-primary">
                            <User className="mr-2 h-4 w-4" /> Profil
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer rounded-lg px-2 py-2 focus:bg-primary/10 focus:text-primary">
                            <Settings className="mr-2 h-4 w-4" /> Ayarlar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer rounded-lg px-2 py-2">
                            <LogOut className="mr-2 h-4 w-4" /> Çıkış Yap
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </header>
    );
}
